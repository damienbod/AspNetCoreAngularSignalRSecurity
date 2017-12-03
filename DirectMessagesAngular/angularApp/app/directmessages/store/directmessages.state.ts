import { OnlineUser } from '../models/online-user';
import { DirectMessage } from '../models/direct-message';

export interface DirectMessagesState {
    onlineUsers: OnlineUser[],
    directMessages: DirectMessage[]
};