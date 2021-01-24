import { sendDirectMessageAction } from './../store/directmessages.action';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { DirectMessagesState } from '../store/directmessages.state';
import * as directMessagesAction from '../store/directmessages.action';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OnlineUser } from '../models/online-user';
import { DirectMessage } from '../models/direct-message';
import * as fromSelectorsStore from '../store/directmessages.selectors';

@Component({
  selector: 'app-direct-message-component',
  templateUrl: './direct-message.component.html',
})
export class DirectMessagesComponent implements OnInit {
  public async: any;
  onlineUser: OnlineUser = { connectionId: '', userName: '' };
  selectedOnlineUserName = '';
  isAuthorized = false;
  message = '';
  onlineUsers$: Observable<OnlineUser[]>;
  directMessages$: Observable<DirectMessage[]>;
  connected$: Observable<boolean>;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.onlineUsers$ = this.store.pipe(select(fromSelectorsStore.selectOnlineUsers));
    this.directMessages$ = this.store.pipe(select(fromSelectorsStore.selectDirectMessages));
    this.connected$ = this.store.pipe(select(fromSelectorsStore.selectConnected));

  }

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
        if (isAuthorized) {
          console.log('isAuthorized getting data');
        }
      }
    );

    console.log('IsAuthorized:' + this.isAuthorized);
  }

  selectChat(onlineuserUserName: string): void {
    this.selectedOnlineUserName = onlineuserUserName;
  }

  sendMessage(): void {
    console.log(
      'send message to:' + this.selectedOnlineUserName + ':' + this.message
    );

    const message = {
      payload: {
        message: this.message,
        userNameTarget: this.selectedOnlineUserName,
      },
    };

    this.store.dispatch(directMessagesAction.sendDirectMessageAction(message));
  }

  getUserInfoName(directMessage: DirectMessage): string {
    if (directMessage.fromOnlineUser) {
      return directMessage.fromOnlineUser.userName;
    }

    return '';
  }

  disconnect(): void {
    this.store.dispatch(directMessagesAction.leaveAction());
  }

  connect(): void {
    this.store.dispatch(directMessagesAction.joinAction());
  }
}
