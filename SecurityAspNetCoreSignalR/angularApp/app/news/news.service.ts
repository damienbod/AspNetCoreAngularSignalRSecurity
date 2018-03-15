import { Subscription } from 'rxjs/Subscription';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HubConnection } from '@aspnet/signalr';
import { NewsItem } from './models/news-item';
import { Store } from '@ngrx/store';
import * as NewsActions from './store/news.action';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class NewsService {

    private _hubConnection: HubConnection;
    private actionUrl: string;
    private headers: HttpHeaders;

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

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
        this._hubConnection.invoke('Send', newsItem);
        return newsItem;
    }

    sendDirectMessage(message: string, userId: string): string {
        this._hubConnection.invoke('SendDM', message, userId);
        return message;
    }

    joinGroup(group: string): void {
        this._hubConnection.invoke('JoinGroup', group);
    }

    leaveGroup(group: string): void {
        this._hubConnection.invoke('LeaveGroup', group);
    }

    getAllGroups(): Observable<string[]> {

        const token = this.oidcSecurityService.getToken();
        if (token !== '') {
            const tokenValue = 'Bearer ' + token;
            this.headers = this.headers.append('Authorization', tokenValue);
        }

        return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
    }

    private init() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
                if (this.isAuthorized) {
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

        this._hubConnection = new HubConnection(`${this.configuration.Server}looney${tokenValue}`);

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

        this._hubConnection.start()
            .then(() => {
                console.log('Hub connection started')
            })
            .catch(() => {
                console.log('Error while establishing connection')
            });
    }

}
