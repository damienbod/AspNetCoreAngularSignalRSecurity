import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HubConnection } from '@aspnet/signalr';
import { Configuration } from '../../app.constants';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as signalR from '@aspnet/signalr';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
    private _hubConnection: HubConnection | undefined;
    async: any;
    message = '';
    messages: string[] = [];

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(
        private configuration: Configuration,
        private oidcSecurityService: OidcSecurityService
    ) {
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
                if (this.isAuthorized) {
                    this.init();
                }
            });
        console.log('IsAuthorized:' + this.isAuthorized);
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }

    sendMessage(): void {
        const data = `Sent: ${this.message}`;
        if (this._hubConnection) {
            this._hubConnection.invoke('Send', data);
        }
        this.messages.push(data);
    }

    private init() {

        const token = this.oidcSecurityService.getToken();
        let tokenValue = '';
        if (token !== '') {
            tokenValue = '?token=' + token;
        }

        this._hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.configuration.Server}signalrhome${tokenValue}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this._hubConnection.start().catch(err => console.error(err.toString()));

        this._hubConnection.on('Send', (data: any) => {
            const received = `Received: ${data}`;
            this.messages.push(received);
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
