export const RECEIVED_NEW_ONLINE_USER = '[dm] RECEIVED_NEW_ONLINE_USER';
export const RECEIVED_ONLINE_USERS = '[dm] RECEIVED_ONLINE_USERS';
export const RECEIVED_USER_LEFT = '[dm] RECEIVED_USER_LEFT';
export const JOIN = '[dm] Join';
export const JOIN_SENT = '[dm] JoinSent';
export const LEAVE = '[dm] LEAVE';
export const LEAVE_SENT = '[dm] LEAVE Sent';
export const SEND_DIRECT_MESSAGE = '[dm] SEND_DIRECT_MESSAGE';
export const SEND_DIRECT_MESSAGE_COMPLETE = '[dm] SEND_DIRECT_MESSAGE_COMPLETE';
export const RECEIVED_DIRECT_MESSAGE = '[dm] RECEIVED_DIRECT_MESSAGE';
export class SendDirectMessageAction {
    constructor(message, userId) {
        this.message = message;
        this.userId = userId;
        this.type = SEND_DIRECT_MESSAGE;
    }
}
export class SendDirectMessageActionComplete {
    constructor(message) {
        this.message = message;
        this.type = SEND_DIRECT_MESSAGE_COMPLETE;
    }
}
export class ReceivedNewOnlineUser {
    constructor(onlineUser) {
        this.onlineUser = onlineUser;
        this.type = RECEIVED_NEW_ONLINE_USER;
    }
}
export class ReceivedOnlineUsers {
    constructor(onlineUsers) {
        this.onlineUsers = onlineUsers;
        this.type = RECEIVED_ONLINE_USERS;
    }
}
export class ReceivedUserLeft {
    constructor(name) {
        this.name = name;
        this.type = RECEIVED_USER_LEFT;
    }
}
export class Leave {
    constructor() {
        this.type = LEAVE;
    }
}
export class LeaveSent {
    constructor() {
        this.type = LEAVE_SENT;
    }
}
export class Join {
    constructor() {
        this.type = JOIN;
    }
}
export class JoinSent {
    constructor() {
        this.type = JOIN_SENT;
    }
}
export class ReceivedDirectMessage {
    constructor(message, onlineUser) {
        this.message = message;
        this.onlineUser = onlineUser;
        this.type = RECEIVED_DIRECT_MESSAGE;
    }
}
//# sourceMappingURL=directmessages.action.js.map