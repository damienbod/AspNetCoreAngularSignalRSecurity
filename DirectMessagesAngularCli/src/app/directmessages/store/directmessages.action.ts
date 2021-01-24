import { Action } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';
import { OnlineUser } from '../models/online-user';
import { ReceivedUserMessageDto } from '../models/ReceivedUserMessageDto';
import { SendDirectMessageDto } from '../models/SendDirectMessageDto';

export const receivedNewOnlineUserAction = createAction(
  '[DM] RECEIVED_NEW_ONLINE_USER',
  props<{ payload: OnlineUser }>()
);
export const receivedOnlineUsersAction = createAction(
  '[DM] RECEIVED_ONLINE_USERS',
  props<{ payload: OnlineUser[] }>()
);
export const receivedUserLeftAction = createAction(
  '[DM] RECEIVED_USER_LEFT',
  props<{ payload: string }>()
);
export const joinAction = createAction('[DM] JOIN');
export const joinActionFinished = createAction('[DM] JOIN FINISHED');
export const leaveAction = createAction('[DM] LEAVE');
export const leaveActionFinished = createAction('[DM] LEAVE FINISHED');

export const sendDirectMessageActionFinished = createAction(
  '[DM] SEND_DIRECT_MESSAGE_FINISHED',
  props<{ payload: string }>()
);
export const sendDirectMessageAction = createAction(
  '[DM] SEND_DIRECT_MESSAGE',
  props<{ payload: SendDirectMessageDto }>()
);
export const receivedDirectMessageForUserAction = createAction(
  '[DM] RECEIVED_DIRECT_MESSAGE',
  props<{ payload: ReceivedUserMessageDto }>()
);


