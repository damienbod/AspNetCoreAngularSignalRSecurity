import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HubConnection } from '@aspnet/signalr-client';
import { Configuration } from '../../app.constants';
import { OidcSecurityService, AuthorizationResult } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html'
})

export class HomeComponent {
    private _hubConnection: HubConnection;
    public async: any;
    message = '';
    messages: string[] = [];

    constructor(
        private configuration: Configuration,
        private oidcSecurityService: OidcSecurityService
    ) {
        if (this.oidcSecurityService.moduleSetup) {
            this.onModuleSetup();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.onModuleSetup();
            });
        }
    }

    private onModuleSetup() {
        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        } else {
            this.oidcSecurityService.getIsAuthorized().subscribe((authorized: boolean) => {
                if (authorized) {
                    this.init();
                }
            });
        }
    }
    public sendMessage(): void {
        const data = `Sent: ${this.message}`;

        this._hubConnection.invoke('Send', data);
        this.messages.push(data);
    }

    init() {
        this._hubConnection = new HubConnection('https://localhost:44390/loopy');

        this._hubConnection.on('Send', (data: any) => {
            const received = `Received: ${data}`;
            this.messages.push(received);
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
