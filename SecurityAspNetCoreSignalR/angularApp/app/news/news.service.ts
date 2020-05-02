import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HubConnection } from '@microsoft/signalr';
import { NewsItem } from './models/news-item';
import { Store } from '@ngrx/store';
import * as NewsActions from './store/news.action';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as signalR from '@microsoft/signalr';

@Injectable()
export class NewsService {

    private _hubConnection: HubConnection | undefined;
    private actionUrl: string;
    private headers: HttpHeaders;

    isAuthorized = false;

    constructor(private http: HttpClient,
        private store: Store<any>,
        private configuration: Configuration,
        private oidcSecurityService: OidcSecurityService
    ) {
        this.actionUrl = `${this.configuration.Server}api/news/`;

        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');

        this.init();
    }

    send(newsItem: NewsItem): NewsItem {
        if (this._hubConnection) {
            this._hubConnection.invoke('Send', newsItem);
        }
        return newsItem;
    }

    sendDirectMessage(message: string, userId: string): string {
        if (this._hubConnection) {
            this._hubConnection.invoke('SendDM', message, userId);
        }
        return message;
    }

    joinGroup(group: string): void {
        if (this._hubConnection) {
            this._hubConnection.invoke('JoinGroup', group);
        }
    }

    leaveGroup(group: string): void {
        if (this._hubConnection) {
            this._hubConnection.invoke('LeaveGroup', group);
        }
    }

    getAllGroups(): Observable<string[]> {

        const token = this.oidcSecurityService.getToken();
        console.log('getAllGroups token:');
        console.log(token);
        if (token !== '') {
            const tokenValue = 'Bearer ' + token;
            this.headers = this.headers.append('Authorization', tokenValue);
        }

        return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
    }

    private init() {
		this.oidcSecurityService.isAuthenticated$.subscribe(
            (isAuthorized: boolean) => {
				this.isAuthorized = isAuthorized;
                if (isAuthorized) {
                    this.initHub();
                }
            });
	
        console.log('IsAuthorized:' + this.isAuthorized);
    }

    private initHub() {
        console.log('initHub');
        const token = this.oidcSecurityService.getToken();
        let tokenValue = '';
        if (token !== '') {
            tokenValue = '?token=' + token;
        }

        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.configuration.Server}looney${tokenValue}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this._hubConnection.start().catch(err => console.error(err.toString()));

        this._hubConnection.on('Send', (newsItem: NewsItem) => {
            this.store.dispatch(new NewsActions.ReceivedItemAction(newsItem));
        });

        this._hubConnection.on('JoinGroup', (data: string) => {
            this.store.dispatch(new NewsActions.ReceivedGroupJoinedAction(data));
        });

        this._hubConnection.on('LeaveGroup', (data: string) => {
            this.store.dispatch(new NewsActions.ReceivedGroupLeftAction(data));
        });

        this._hubConnection.on('History', (newsItems: NewsItem[]) => {
            this.store.dispatch(new NewsActions.ReceivedGroupHistoryAction(newsItems));
        });
    }
}
