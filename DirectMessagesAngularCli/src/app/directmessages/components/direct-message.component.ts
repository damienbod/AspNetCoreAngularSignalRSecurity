import { sendDirectMessageAction } from './../store/directmessages.action';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { DirectMessagesState } from '../store/directmessages.state';
import * as directMessagesAction from '../store/directmessages.action';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OnlineUser } from '../models/online-user';
import { DirectMessage } from '../models/direct-message';

@Component({
  selector: 'app-direct-message-component',
  templateUrl: './direct-message.component.html',
})
export class DirectMessagesComponent implements OnInit, OnDestroy {
  public async: any;
  onlineUsers: OnlineUser[] = [];
  onlineUser: OnlineUser = { connectionId: '', userName: '' };
  directMessages: DirectMessage[] = [];
  selectedOnlineUserName = '';
  dmState$: Observable<DirectMessagesState>;
  dmStateSubscription: Subscription | undefined;
  isAuthorized = false;
  connected = false;
  message = '';

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.dmState$ = this.store.select<DirectMessagesState>((state) => state.dm);
    this.dmStateSubscription = this.store
      .select<DirectMessagesState>((state) => state.dm)
      .subscribe((o: DirectMessagesState) => {
        this.connected = o.connected;
        console.log('o');
        console.log(o);
      });
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

  ngOnDestroy(): void {
    if (this.dmStateSubscription) {
      this.dmStateSubscription.unsubscribe();
    }
  }

  selectChat(onlineuserUserName: string): void {
    this.selectedOnlineUserName = onlineuserUserName;
  }

  sendMessage(): void {
    console.log(
      'send message to:' + this.selectedOnlineUserName + ':' + this.message
    );

    const message = { payload: {
      message: this.message,
      userNameTarget: this.selectedOnlineUserName
    }};

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
