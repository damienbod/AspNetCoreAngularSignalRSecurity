import { switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Rx';

import * as directMessagesAction from './directmessages.action';
import { DirectMessagesService } from '../directmessages.service';

@Injectable()
export class DirectMessagesEffects {


    @Effect() sendDirectMessage$ =
    this.actions$.ofType<directMessagesAction.SendDirectMessageAction>(directMessagesAction.SEND_DIRECT_MESSAGE).pipe(
        switchMap((action: directMessagesAction.SendDirectMessageAction) => {
            this.directMessagesService.sendDirectMessage(action.message, action.userId);
            return Observable.of(new directMessagesAction.SendDirectMessageActionComplete(action.message));
        }));

    @Effect() Leave$ =
    this.actions$.ofType<directMessagesAction.Leave>(directMessagesAction.LEAVE).pipe(
        switchMap(() => {
            this.directMessagesService.leave();
            return Observable.of(new directMessagesAction.LeaveSent());
        }));

    @Effect() Join$ =
    this.actions$.ofType<directMessagesAction.Join>(directMessagesAction.JOIN).pipe(
        switchMap(() => {
            this.directMessagesService.join();
            return Observable.of(new directMessagesAction.JoinSent());
            }));

    constructor(
        private directMessagesService: DirectMessagesService,
        private actions$: Actions
    ) { }
}
