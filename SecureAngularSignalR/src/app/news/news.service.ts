import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { NewsItem } from './models/news-item';
import { Store } from '@ngrx/store';
import * as newsAction from './store/news.action';
import { Configuration } from '../app.constants';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as signalR from '@microsoft/signalr';

@Injectable()
export class NewsService {
  private hubConnection: HubConnection | undefined;
  private actionUrl: string;
  private headers: HttpHeaders;
  private token: string = '';
  isAuthorized = false;

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    private configuration: Configuration,
    private oidcSecurityService: OidcSecurityService
  ) {
    console.warn('BEGIN NEWS SERVICE ...')
    this.init();
    this.actionUrl = 'https://localhost:44390/api/news/';

    this.headers = new HttpHeaders();
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.headers = this.headers.set('Accept', 'application/json');
  }

  send(newsItem: NewsItem): NewsItem {
    if (this.hubConnection) {
      this.hubConnection.invoke('Send', newsItem);
    }
    return newsItem;
  }

  sendDirectMessage(message: string, userId: string): string {
    if (this.hubConnection) {
      this.hubConnection.invoke('SendDM', message, userId);
    }
    return message;
  }

  joinGroup(group: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('JoinGroup', group);
    }
  }

  leaveGroup(group: string): void {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveGroup', group);
    }
  }

  getAllGroups(): Observable<string[]> {
    return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
  }

  private init() {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthorized = isAuthenticated;
        if (isAuthenticated) {
          this.initHub();
        }
      }
    );

    console.log('IsAuthorized:' + this.isAuthorized);
  }

  private initHub() {
    console.warn('initHub');

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthorized = isAuthenticated;
        if (isAuthenticated) {

          this.oidcSecurityService.getAccessToken().subscribe((token) => {

            let tokenValue = '';
            this.token = token;
            const tokenApiHeader = 'Bearer ' + this.token;
            this.headers = this.headers.append('Authorization', tokenApiHeader);
            console.log(tokenApiHeader)
            tokenValue = '?token=' + token;


            this.hubConnection = new signalR.HubConnectionBuilder()
              .withUrl(`${this.configuration.Server}looney${tokenValue}`)
              .configureLogging(signalR.LogLevel.Information)
              .build();

            this.hubConnection.start().catch((err) => console.error(err.toString()));

            this.hubConnection.on('Send', (newsItem: NewsItem) => {
              this.store.dispatch(
                newsAction.receiveNewsItemAction({ payload: newsItem })
              );
            });

            this.hubConnection.on('JoinGroup', (data: string) => {
              console.log('received data from the hub');
              console.log(data);
              this.store.dispatch(
                newsAction.receiveGroupJoinedAction({ payload: data })
              );
            });

            this.hubConnection.on('LeaveGroup', (data: string) => {
              this.store.dispatch(newsAction.receiveGroupLeftAction({ payload: data }));
            });

            this.hubConnection.on('History', (newsItems: NewsItem[]) => {
              console.log('received history from the hub');
              console.log(newsItems);
              this.store.dispatch(
                newsAction.receiveNewsGroupHistoryAction({ payload: newsItems })
              );
            });
          });

        }
      }
    );
  }
}
