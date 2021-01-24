import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as directMessagesAction from './directmessages.action';
import { DirectMessagesService } from '../directmessages.service';

@Injectable()
export class DirectMessagesEffects {
  constructor(
    private directMessagesService: DirectMessagesService,
    private actions$: Actions
  ) {}

  joinAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(directMessagesAction.joinAction),
      switchMap(() => {
        this.directMessagesService.join();
        return of(directMessagesAction.joinActionFinished());
      })
    )
  );

  leaveAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(directMessagesAction.leaveAction),
      switchMap(() => {
        this.directMessagesService.leave();
        return of(directMessagesAction.leaveActionFinished());
      })
    )
  );

  sendNewsItemAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(directMessagesAction.sendDirectMessageAction),
      map((action) => action.payload),
      switchMap((payload) => {
        this.directMessagesService.sendDirectMessage(
          payload.message,
          payload.userNameTarget
        );
        return of(
          directMessagesAction.sendDirectMessageActionFinished({
            payload: payload.message,
          })
        );
      })
    )
  );
}
