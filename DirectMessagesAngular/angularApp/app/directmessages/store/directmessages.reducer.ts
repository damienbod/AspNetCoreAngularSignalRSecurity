import { DirectMessagesState } from './directmessages.state';
import * as directMessagesAction from './directmessages.action';
import { DirectMessage } from '../models/direct-message';

export const initialState: DirectMessagesState = {
    onlineUsers: [],
    directMessages: [],
    connected: false
};

export function directMessagesReducer(state = initialState, action: directMessagesAction.Actions): DirectMessagesState {
    switch (action.type) {

        case directMessagesAction.RECEIVED_DIRECT_MESSAGE: {

            const directMessage: DirectMessage = {
                message: action.message,
                fromOnlineUser: action.onlineUser
            }

            return Object.assign({}, state, {
                directMessages: state.directMessages.concat(directMessage),
            });
        }

        case directMessagesAction.RECEIVED_USER_LEFT: {
            const index = state.onlineUsers.findIndex(obj => obj.userName === action.name);
            const list = [...state.onlineUsers]; // clone the array
            list.splice(index, 1);
            return Object.assign({}, state, {
                onlineUsers: list
            });
        }

        case directMessagesAction.SEND_DIRECT_MESSAGE_COMPLETE: {

            const directMessage: DirectMessage = {
                message: action.message,
                fromOnlineUser: null
            }

            return Object.assign({}, state, {
                directMessages: state.directMessages.concat(directMessage),
            });
        }

        case directMessagesAction.RECEIVED_NEW_ONLINE_USER:
            return Object.assign({}, state, {
                onlineUsers: state.onlineUsers.concat(action.onlineUser),
            });

        case directMessagesAction.RECEIVED_ONLINE_USERS:
            return Object.assign({}, state, {
                onlineUsers: action.onlineUsers
            });

        case directMessagesAction.JOIN_SENT:
            return Object.assign({}, state, {
                connected: true,
            });

        case directMessagesAction.LEAVE_SENT:
            return Object.assign({}, state, {
                connected: false,
            });

        default:
            return state;

    }
}

