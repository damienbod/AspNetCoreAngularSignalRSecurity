import 'rxjs/add/operator/map';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HubConnection } from '@aspnet/signalr-client';
import { NewsItem } from './models/news-item';
import { Store } from '@ngrx/store';
import { NewsState } from './store/news.state';
import * as NewsActions from './store/news.action';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class NewsService {

    private _hubConnection: HubConnection;
    private actionUrl: string;
    private headers: HttpHeaders;

    constructor(private http: HttpClient,
        private store: Store<any>,
        private configuration: Configuration,
        private oidcSecurityService: OidcSecurityService
    ) {
        // this.init();
        this.actionUrl = this.configuration.Server + 'api/news/';

        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');
    }

    send(newsItem: NewsItem): NewsItem {
        this._hubConnection.invoke('Send', newsItem);
        return newsItem;
    }

    joinGroup(group: string): void {
        this._hubConnection.invoke('JoinGroup', group);
    }

    leaveGroup(group: string): void {
        this._hubConnection.invoke('LeaveGroup', group);
    }

    getAllGroups(): Observable<string[]> {
        return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
    }

    private init() {

        const token = this.oidcSecurityService.getToken();
        let tokenValue = '';
        if (token !== '') {
            tokenValue = '?token=' + token;
            this.headers.append('Authorization', tokenValue);
        }

        // this.connection = new signalR.HubConnection(url + '?token=' + token, options);
        this._hubConnection = new HubConnection('https://localhost:44390/looney' + tokenValue);

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
            .catch(err => {
                console.log('Error while establishing connection')
            });
    }

}
