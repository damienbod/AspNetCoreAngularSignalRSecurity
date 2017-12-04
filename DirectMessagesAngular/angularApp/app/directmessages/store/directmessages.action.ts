import { Action } from '@ngrx/store';
import { OnlineUser } from '../models/online-user';

export const RECEIVED_NEW_ONLINE_USER = '[dm] RECEIVED_NEW_ONLINE_USER';
export const RECEIVED_ONLINE_USERS = '[dm] RECEIVED_ONLINE_USERS';

export const JOIN = '[dm] Join';
export const JOIN_SENT = '[dm] JoinSent';

export const SEND_DIRECT_MESSAGE = '[dm] SEND_DIRECT_MESSAGE';
export const SEND_DIRECT_MESSAGE_COMPLETE = '[dm] SEND_DIRECT_MESSAGE_COMPLETE';
export const RECEIVED_DIRECT_MESSAGE = '[dm] RECEIVED_DIRECT_MESSAGE';

export class SendDirectMessageAction implements Action {
    readonly type = SEND_DIRECT_MESSAGE;

    constructor(public message: string, public userId: string) { }
}

export class SendDirectMessageActionComplete implements Action {
    readonly type = SEND_DIRECT_MESSAGE_COMPLETE;

    constructor(public message: string) { }
}

export class ReceivedNewOnlineUser implements Action {
    readonly type = RECEIVED_NEW_ONLINE_USER;

    constructor(public onlineUser: OnlineUser) { }
}

export class ReceivedOnlineUsers implements Action {
    readonly type = RECEIVED_ONLINE_USERS;

    constructor(public onlineUsers: OnlineUser[]) { }
}


export class ReceivedDirectMessage implements Action {
    readonly type = RECEIVED_DIRECT_MESSAGE;

    constructor(public message: string, public onlineUser: OnlineUser) { }
}

export type Actions
    = SendDirectMessageAction
    | SendDirectMessageActionComplete
    | ReceivedNewOnlineUser
    | ReceivedOnlineUsers
    | ReceivedDirectMessage;

