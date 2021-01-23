var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import * as directMessagesAction from "../store/directmessages.action";
import { OidcSecurityService } from "angular-auth-oidc-client";
let DirectMessagesComponent = class DirectMessagesComponent {
  constructor(store, oidcSecurityService) {
    this.store = store;
    this.oidcSecurityService = oidcSecurityService;
    this.onlineUsers = [];
    this.onlineUser = { connectionId: "", userName: "" };
    this.directMessages = [];
    this.selectedOnlineUserName = "";
    this.isAuthorized = false;
    this.connected = false;
    this.message = "";
    this.dmState$ = this.store.select((state) => state.dm);
    this.dmStateSubscription = this.store
      .select((state) => state.dm)
      .subscribe((o) => {
        this.connected = o.dm.connected;
        console.log("o.dm");
        console.log(o.dm);
      });
  }
  sendDm() {
    this.store.dispatch(
      new directMessagesAction.SendDirectMessageAction(
        this.message,
        this.onlineUser.userName
      )
    );
  }
  ngOnInit() {
    this.oidcSecurityService.isAuthenticated$.subscribe((isAuthorized) => {
      this.isAuthorized = isAuthorized;
      if (isAuthorized) {
        console.log("isAuthorized getting data");
      }
    });
    console.log("IsAuthorized:" + this.isAuthorized);
  }
  ngOnDestroy() {
    if (this.dmStateSubscription) {
      this.dmStateSubscription.unsubscribe();
    }
  }
  selectChat(onlineuserUserName) {
    this.selectedOnlineUserName = onlineuserUserName;
  }
  sendMessage() {
    console.log(
      "send message to:" + this.selectedOnlineUserName + ":" + this.message
    );
    this.store.dispatch(
      new directMessagesAction.SendDirectMessageAction(
        this.message,
        this.selectedOnlineUserName
      )
    );
  }
  getUserInfoName(directMessage) {
    if (directMessage.fromOnlineUser) {
      return directMessage.fromOnlineUser.userName;
    }
    return "";
  }
  disconnect() {
    this.store.dispatch(new directMessagesAction.Leave());
  }
  connect() {
    this.store.dispatch(new directMessagesAction.Join());
  }
};
DirectMessagesComponent = __decorate(
  [
    Component({
      selector: "app-direct-message-component",
      templateUrl: "./direct-message.component.html",
    }),
    __metadata("design:paramtypes", [Store, OidcSecurityService]),
  ],
  DirectMessagesComponent
);
export { DirectMessagesComponent };
//# sourceMappingURL=direct-message.component.js.map
