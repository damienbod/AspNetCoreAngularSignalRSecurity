import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

import { ImageMessage } from '../imagemessage';

@Component({
  selector: 'app-images-component',
  templateUrl: './images.component.html',
})
export class ImagesComponent implements OnInit {
  private _hubConnection: HubConnection | undefined;
  public async: any;
  message = '';
  messages: string[] = [];

  images: ImageMessage[] = [];

  constructor() {}

  ngOnInit() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44390/zub')
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    this._hubConnection.stop();

    this._hubConnection.start().catch((err) => {
      console.error(err.toString());
    });

    this._hubConnection.on('ImageMessage', (data: any) => {
      console.log(data);
      this.images.push(data);
    });
  }
}
