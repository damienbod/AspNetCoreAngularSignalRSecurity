import { DirectMessagesState } from './directmessages.state';
import * as directMessagesAction from './directmessages.action';
import { DirectMessage } from '../models/direct-message';

export const initialState: DirectMessagesState = {
    onlineUsers: [],
    directMessages: []
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

            return Object.assign({}, state, {
                onlineUsers: state.onlineUsers.filter(obj => obj.userName === action.name)
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

        default:
            return state;

    }
}
