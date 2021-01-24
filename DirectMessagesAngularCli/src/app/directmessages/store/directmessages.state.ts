import { OnlineUser } from '../models/online-user';
import { DirectMessage } from '../models/direct-message';

export interface DirectMessagesStateContainer {
  onlineUsers: OnlineUser[];
  directMessages: DirectMessage[];
  connected: boolean;
}

export interface DirectMessagesState {
  dm: DirectMessagesStateContainer;
}
