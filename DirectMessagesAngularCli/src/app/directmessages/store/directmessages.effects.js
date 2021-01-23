var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as directMessagesAction from './directmessages.action';
import { DirectMessagesService } from '../directmessages.service';
let DirectMessagesEffects = class DirectMessagesEffects {
    constructor(directMessagesService, actions$) {
        this.directMessagesService = directMessagesService;
        this.actions$ = actions$;
        this.sendDirectMessage$ = this.actions$.pipe(ofType(directMessagesAction.SEND_DIRECT_MESSAGE), switchMap((action) => {
            this.directMessagesService.sendDirectMessage(action.message, action.userId);
            return of(new directMessagesAction.SendDirectMessageActionComplete(action.message));
        }));
        this.Leave$ = this.actions$.pipe(ofType(directMessagesAction.LEAVE), switchMap(() => {
            this.directMessagesService.leave();
            return of(new directMessagesAction.LeaveSent());
        }));
        this.Join$ = this.actions$.pipe(ofType(directMessagesAction.JOIN), switchMap(() => {
            this.directMessagesService.join();
            return of(new directMessagesAction.JoinSent());
        }));
    }
};
__decorate([
    Effect(),
    __metadata("design:type", Observable)
], DirectMessagesEffects.prototype, "sendDirectMessage$", void 0);
__decorate([
    Effect(),
    __metadata("design:type", Observable)
], DirectMessagesEffects.prototype, "Leave$", void 0);
__decorate([
    Effect(),
    __metadata("design:type", Observable)
], DirectMessagesEffects.prototype, "Join$", void 0);
DirectMessagesEffects = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DirectMessagesService,
        Actions])
], DirectMessagesEffects);
export { DirectMessagesEffects };
//# sourceMappingURL=directmessages.effects.js.map