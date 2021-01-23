import { Action } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';
import { NewsItem } from '../models/news-item';

export const joinGroupAction = createAction(
  '[News] JOIN_GROUP',
  props<{ payload: string }>()
);
export const joinGroupFinishedAction = createAction(
  '[News] JOIN_GROUP_COMPLETE',
  props<{ payload: string }>()
);
export const leaveGroupAction = createAction(
  '[News] LEAVE_GROUP',
  props<{ payload: string }>()
);
export const leaveGroupFinishedAction = createAction(
  '[News] LEAVE_GROUP_COMPLETE',
  props<{ payload: string }>()
);
export const sendNewsItemAction = createAction(
  '[News] SEND_NEWS_ITEM',
  props<{ payload: NewsItem }>()
);
export const sendNewsItemFinishedAction = createAction(
  '[News] SEND_NEWS_ITEM_COMPLETE',
  props<{ payload: NewsItem }>()
);
export const selectAllNewsGroupsAction = createAction(
  '[News] SELECTALL_GROUPS'
);
export const selectAllNewsGroupsFinishedAction = createAction(
  '[News] SELECTALL_GROUPS_COMPLETE',
  props<{ payload: string[] }>()
);
export const recieveNewsItemAction = createAction(
  '[News] RECEIVED_NEWS_ITEM',
  props<{ payload: NewsItem }>()
);
export const recieveGroupJoinedAction = createAction(
  '[News] RECEIVED_GROUP_JOINED',
  props<{ payload: string }>()
);
export const recieveGroupLeftAction = createAction(
  '[News] RECEIVED_GROUP_LEFT',
  props<{ payload: string }>()
);
export const recieveNewsGroupHistoryAction = createAction(
  '[News] RECEIVED_GROUP_HISTORY',
  props<{ payload: NewsItem[] }>()
);
