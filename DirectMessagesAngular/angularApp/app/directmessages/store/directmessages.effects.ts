import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';

import * as directMessagesAction from './directmessages.action';
import { DirectMessagesService } from '../directmessages.service';

@Injectable()
export class DirectMessagesEffects {


    @Effect()
    sendDirectMessage$: Observable<Action> = this.actions$.pipe(
        ofType<directMessagesAction.SendDirectMessageAction>(directMessagesAction.SEND_DIRECT_MESSAGE),
        switchMap((action: directMessagesAction.SendDirectMessageAction) => {
            this.directMessagesService.sendDirectMessage(action.message, action.userId);
            return observableOf(new directMessagesAction.SendDirectMessageActionComplete(action.message));
        }));

    @Effect()
    Leave$: Observable<Action> = this.actions$.pipe(
        ofType<directMessagesAction.Leave>(directMessagesAction.LEAVE),
        switchMap(() => {
            this.directMessagesService.leave();
            return observableOf(new directMessagesAction.LeaveSent());
        }));

    @Effect() Join$: Observable<Action> = this.actions$.pipe(
        ofType<directMessagesAction.Join>(directMessagesAction.JOIN),
        switchMap(() => {
            this.directMessagesService.join();
            return observableOf(new directMessagesAction.JoinSent());
            }));

    constructor(
        private directMessagesService: DirectMessagesService,
        private actions$: Actions
    ) { }
}
