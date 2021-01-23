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
import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as directMessagesActions from "./store/directmessages.action";
import { OidcSecurityService } from "angular-auth-oidc-client";
import * as signalR from "@microsoft/signalr";
let DirectMessagesService = class DirectMessagesService {
  constructor(store, oidcSecurityService) {
    this.store = store;
    this.oidcSecurityService = oidcSecurityService;
    this.isAuthorized = false;
    this.headers = new HttpHeaders();
    this.headers = this.headers.set("Content-Type", "application/json");
    this.headers = this.headers.set("Accept", "application/json");
    this.init();
  }
  sendDirectMessage(message, userId) {
    if (this._hubConnection) {
      this._hubConnection.invoke("SendDirectMessage", message, userId);
    }
    return message;
  }
  leave() {
    if (this._hubConnection) {
      this._hubConnection.invoke("Leave");
    }
  }
  join() {
    console.log("send join");
    if (this._hubConnection) {
      this._hubConnection.invoke("Join");
    }
  }
  init() {
    this.oidcSecurityService.isAuthenticated$.subscribe((isAuthorized) => {
      this.isAuthorized = isAuthorized;
      if (this.isAuthorized) {
        this.initHub();
      }
    });
    console.log("IsAuthorized:" + this.isAuthorized);
  }
  initHub() {
    console.log("initHub");
    const token = this.oidcSecurityService.getToken();
    let tokenValue = "";
    if (token !== "") {
      tokenValue = "?token=" + token;
    }
    const url = "https://localhost:44390/";
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${url}usersdm${tokenValue}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();
    this._hubConnection.start().catch((err) => console.error(err.toString()));
    this._hubConnection.on("NewOnlineUser", (onlineUser) => {
      console.log("NewOnlineUser received");
      console.log(onlineUser);
      this.store.dispatch(
        new directMessagesActions.ReceivedNewOnlineUser(onlineUser)
      );
    });
    this._hubConnection.on("OnlineUsers", (onlineUsers) => {
      console.log("OnlineUsers received");
      console.log(onlineUsers);
      this.store.dispatch(
        new directMessagesActions.ReceivedOnlineUsers(onlineUsers)
      );
    });
    this._hubConnection.on("Joined", (onlineUser) => {
      console.log("Joined received");
      this.store.dispatch(new directMessagesActions.JoinSent());
      console.log(onlineUser);
    });
    this._hubConnection.on("SendDM", (message, onlineUser) => {
      console.log("SendDM received");
      this.store.dispatch(
        new directMessagesActions.ReceivedDirectMessage(message, onlineUser)
      );
    });
    this._hubConnection.on("UserLeft", (name) => {
      console.log("UserLeft received");
      this.store.dispatch(new directMessagesActions.ReceivedUserLeft(name));
    });
  }
};
DirectMessagesService = __decorate(
  [Injectable(), __metadata("design:paramtypes", [Store, OidcSecurityService])],
  DirectMessagesService
);
export { DirectMessagesService };
//# sourceMappingURL=directmessages.service.js.map
