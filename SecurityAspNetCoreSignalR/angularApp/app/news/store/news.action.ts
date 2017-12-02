import { Action } from '@ngrx/store';
import { NewsItem } from '../models/news-item';
import { OnlineUser } from '../models/online-user';

export const JOIN_GROUP = '[news] JOIN_GROUP';
export const LEAVE_GROUP = '[news] LEAVE_GROUP';
export const JOIN_GROUP_COMPLETE = '[news] JOIN_GROUP_COMPLETE';
export const LEAVE_GROUP_COMPLETE = '[news] LEAVE_GROUP_COMPLETE';
export const SEND_NEWS_ITEM = '[news] SEND_NEWS_ITEM';
export const SEND_NEWS_ITEM_COMPLETE = '[news] SEND_NEWS_ITEM_COMPLETE';
export const RECEIVED_NEWS_ITEM = '[news] RECEIVED_NEWS_ITEM';
export const RECEIVED_GROUP_JOINED = '[news] RECEIVED_GROUP_JOINED';
export const RECEIVED_GROUP_LEFT = '[news] RECEIVED_GROUP_LEFT';
export const RECEIVED_GROUP_HISTORY = '[news] RECEIVED_GROUP_HISTORY';

export const RECEIVED_NEW_ONLINE_USER = '[news] RECEIVED_NEW_ONLINE_USER';
export const RECEIVED_ONLINE_USERS = '[news] RECEIVED_ONLINE_USERS';

export const SELECTALL_GROUPS = '[news] Select All Groups';
export const SELECTALL_GROUPS_COMPLETE = '[news] Select All Groups Complete';

export const SEND_DIRECT_MESSAGE = '[news] SEND_DIRECT_MESSAGE';
export const SEND_DIRECT_MESSAGE_COMPLETE = '[news] SEND_DIRECT_MESSAGE_COMPLETE';
export const RECEIVED_DIRECT_MESSAGE = '[news] RECEIVED_DIRECT_MESSAGE';

export class SendDirectMessageAction implements Action {
    readonly type = SEND_DIRECT_MESSAGE;

    constructor(public message: string, public userId: string) { }
}

export class SendDirectMessageActionComplete implements Action {
    readonly type = SEND_DIRECT_MESSAGE_COMPLETE;

    constructor(public message: string) { }
}

export class JoinGroupAction implements Action {
    readonly type = JOIN_GROUP;

    constructor(public group: string) { }
}

export class LeaveGroupAction implements Action {
    readonly type = LEAVE_GROUP;

    constructor(public group: string) { }
}


export class JoinGroupActionComplete implements Action {
    readonly type = JOIN_GROUP_COMPLETE;

    constructor(public group: string) { }
}

export class LeaveGroupActionComplete implements Action {
    readonly type = LEAVE_GROUP_COMPLETE;

    constructor(public group: string) { }
}

export class SendNewsItemAction implements Action {
    readonly type = SEND_NEWS_ITEM;

    constructor(public newsItem: NewsItem) { }
}

export class SendNewsItemActionComplete implements Action {
    readonly type = SEND_NEWS_ITEM_COMPLETE;

    constructor(public newsItem: NewsItem) { }
}

export class ReceivedItemAction implements Action {
    readonly type = RECEIVED_NEWS_ITEM;

    constructor(public newsItem: NewsItem) { }
}

export class ReceivedGroupJoinedAction implements Action {
    readonly type = RECEIVED_GROUP_JOINED;

    constructor(public group: string) { }
}

export class ReceivedGroupLeftAction implements Action {
    readonly type = RECEIVED_GROUP_LEFT;

    constructor(public group: string) { }
}

export class ReceivedGroupHistoryAction implements Action {
    readonly type = RECEIVED_GROUP_HISTORY;

    constructor(public newsItems: NewsItem[]) { }
}

export class SelectAllGroupsAction implements Action {
    readonly type = SELECTALL_GROUPS;

    constructor() { }
}

export class SelectAllGroupsActionComplete implements Action {
    readonly type = SELECTALL_GROUPS_COMPLETE;

    constructor(public groups: string[]) { }
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
    = JoinGroupAction
    | LeaveGroupAction
    | JoinGroupActionComplete
    | LeaveGroupActionComplete
    | SendNewsItemAction
    | SendNewsItemActionComplete
    | ReceivedItemAction
    | ReceivedGroupJoinedAction
    | ReceivedGroupLeftAction
    | ReceivedGroupHistoryAction
    | SelectAllGroupsAction
    | SelectAllGroupsActionComplete
    | SendDirectMessageAction
    | SendDirectMessageActionComplete
    | ReceivedNewOnlineUser
    | ReceivedOnlineUsers
    | ReceivedDirectMessage;

