import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Rx';

import * as newsAction from './news.action';
import { NewsService } from '../news.service';

@Injectable()
export class NewsEffects {

    @Effect() sendNewItem$: Observable<Action> = this.actions$.ofType(newsAction.SEND_NEWS_ITEM)
        .switchMap((action: newsAction.SendNewsItemAction) => {
            this.newsService.send(action.newsItem);
            return Observable.of(new newsAction.SendNewsItemActionComplete(action.newsItem));
        });

    @Effect() joinGroup$: Observable<Action> = this.actions$.ofType(newsAction.JOIN_GROUP)
        .switchMap((action: newsAction.JoinGroupAction) => {
            this.newsService.joinGroup(action.group);
            return Observable.of(new newsAction.JoinGroupActionComplete(action.group));
        });

    @Effect() leaveGroup$: Observable<Action> = this.actions$.ofType(newsAction.LEAVE_GROUP)
        .switchMap((action: newsAction.LeaveGroupAction) => {
            this.newsService.leaveGroup(action.group);
            return Observable.of(new newsAction.LeaveGroupActionComplete(action.group));
        });

    @Effect() getAllGroups$: Observable<Action> = this.actions$.ofType(newsAction.SELECTALL_GROUPS)
        .switchMap(() =>
            this.newsService.getAllGroups()
                .map((data: string[]) => {
                    return new newsAction.SelectAllGroupsActionComplete(data);
                })
                .catch(() => {
                    return of({ type: 'getAllGroups$' })
                })
        );

    constructor(
        private newsService: NewsService,
        private actions$: Actions
    ) { }
}
