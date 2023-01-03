import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as newsAction from './news.action';
import { NewsService } from '../news.service';

@Injectable()
export class NewsEffects {
  constructor(private newsService: NewsService, private actions$: Actions) {}

  sendNewsItemAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newsAction.sendNewsItemAction),
      switchMap(({ payload }) => {
        this.newsService.send(payload);
        return of(newsAction.sendNewsItemFinishedAction({ payload }));
      })
    )
  );

  joinGroupAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newsAction.joinGroupAction),
      switchMap(({ payload }) => {
        this.newsService.joinGroup(payload);
        return of(newsAction.joinGroupFinishedAction({ payload }));
      })
    )
  );

  leaveGroupAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newsAction.leaveGroupAction),
      map((action) => action.payload),
      switchMap((payload) => {
        this.newsService.leaveGroup(payload);
        return of(newsAction.leaveGroupFinishedAction({ payload }));
      })
    )
  );

  selectAllNewsGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(newsAction.selectAllNewsGroupsAction),
      switchMap(() =>
        this.newsService.getAllGroups().pipe(
          map((payload) =>
            newsAction.selectAllNewsGroupsFinishedAction({ payload })
          ),
          catchError((error) => of(error))
        )
      )
    )
  );
}
