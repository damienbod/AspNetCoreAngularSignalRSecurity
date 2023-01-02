import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { Configuration } from '../../app.constants';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private hubConnection: HubConnection | undefined;
  async: any;
  message = '';
  messages: string[] = [];

  isAuthenticated = false;

  constructor(
    private configuration: Configuration,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit() {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.init();
        }
      }
    );
  }

  sendMessage(): void {
    const data = `Sent: ${this.message}`;
    if (this.hubConnection) {
      this.hubConnection.invoke('Send', data);
    }
    this.messages.push(data);
  }

  private init() {
    let tokenValue = '';
    this.oidcSecurityService.getAccessToken().subscribe((token) => {
      // console.log(token)
      if (token !== '') {
        tokenValue = '?token=' + token;
      }
    });

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.configuration.Server}signalrhome${tokenValue}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start().catch((err) => console.error(err.toString()));

    this.hubConnection.on('Send', (data: any) => {
      const received = `Received: ${data}`;
      this.messages.push(received);
    });
  }
}
