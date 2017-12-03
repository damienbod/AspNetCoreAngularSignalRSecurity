import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';

import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HubConnection } from '@aspnet/signalr-client';
import { Store } from '@ngrx/store';
import * as directMessagesActions from './store/directmessages.action';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OnlineUser } from './models/online-user';

@Injectable()
export class DirectMessagesService {

    private _hubConnection: HubConnection;
    private headers: HttpHeaders;

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(
        private store: Store<any>,
        private oidcSecurityService: OidcSecurityService
    ) {
        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');

        this.init();
    }

    sendDirectMessage(message: string, userId: string): string {
        this._hubConnection.invoke('SendDM', message, userId);
        return message;
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
        const url = 'https://localhost:44390/';
        this._hubConnection = new HubConnection(`${url}looney${tokenValue}`);

        this._hubConnection.on('NewOnlineUser', (onlineUser: OnlineUser) => {
            this.store.dispatch(new directMessagesActions.ReceivedNewOnlineUser(onlineUser));
        });

        this._hubConnection.on('OnlineUsers', (onlineUsers: OnlineUser[]) => {
            this.store.dispatch(new directMessagesActions.ReceivedOnlineUsers(onlineUsers));
        });

        this._hubConnection.on('NewOnlineUser', (message: string, onlineUser: OnlineUser) => {
            this.store.dispatch(new directMessagesActions.ReceivedDirectMessage(message, onlineUser));
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
