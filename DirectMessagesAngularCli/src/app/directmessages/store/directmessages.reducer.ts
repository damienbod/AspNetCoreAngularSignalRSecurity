import { DirectMessagesState } from './directmessages.state';
import * as directMessagesAction from './directmessages.action';
import { DirectMessage } from '../models/direct-message';
import { createReducer, on, Action } from '@ngrx/store';

export const initialState: DirectMessagesState = {
  onlineUsers: [],
  directMessages: [],
  connected: false,
};

// on(
//   YOUR_ACTION(S)_HERE,
//   (state, { payload }) => {
//   const { news } = state;
//   const { newsItems, groups } = news;
//     return {
//       ...state,
//       news: {
//     newsItems,
//     groups: [...groups, action.group]
//   }
//     };
//   }
// ),

// or

// on(
//   YOUR_ACTION(S)_HERE,
//   (state, { payload }) => {
//   const { news } = state;
//     return {
//       ...state,
//       news: {
//     newsItems: news.newsItems,
//     groups: [...news.groups, action.group]
//   }
//     };
//   }
// ),

const directMessagesReducerInternal = createReducer(
  initialState,
  on(directMessagesAction.joinActionFinished, (state, { payload }) => {
    const allGroups = [...state.groups, payload];
    const allGroupsWithoutDuplicates = [...new Set(allGroups)];
    return {
      ...state,
      groups: [...allGroupsWithoutDuplicates],
    };
  })

  );

export function directMessagesReducer(
  state: DirectMessagesState | undefined,
  action: Action
): DirectMessagesState {
  return directMessagesReducerInternal(state, action);
}




export function directMessagesReducerOld(
  state = initialState,
  action: directMessagesAction.Actions
): DirectMessagesState {
  switch (action.type) {

    case directMessagesAction.RECEIVED_DIRECT_MESSAGE: {
      const directMessage: DirectMessage = {
        message: action.message,
        fromOnlineUser: action.onlineUser,
      };

      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages.concat(directMessage),
          connected: state.dm.connected,
          onlineUsers: state.dm.onlineUsers,
        },
      });
    }

    case directMessagesAction.RECEIVED_USER_LEFT: {
      const index = state.dm.onlineUsers.findIndex(
        (obj) => obj.userName === action.name
      );
      const list = [...state.dm.onlineUsers]; // clone the array
      list.splice(index, 1);
      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages,
          connected: state.dm.connected,
          onlineUsers: list,
        },
      });
    }

    case directMessagesAction.SEND_DIRECT_MESSAGE_COMPLETE: {
      const directMessage: DirectMessage = {
        message: action.message,
        fromOnlineUser: null,
      };

      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages.concat(directMessage),
          connected: state.dm.connected,
          onlineUsers: state.dm.onlineUsers,
        },
      });
    }

    case directMessagesAction.RECEIVED_NEW_ONLINE_USER:
      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages,
          connected: state.dm.connected,
          onlineUsers: state.dm.onlineUsers.concat(action.onlineUser),
        },
      });

    case directMessagesAction.RECEIVED_ONLINE_USERS:
      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages,
          connected: state.dm.connected,
          onlineUsers: action.onlineUsers,
        },
      });

    case directMessagesAction.JOIN_SENT:
      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages,
          connected: true,
          onlineUsers: state.dm.onlineUsers,
        },
      });

    case directMessagesAction.LEAVE_SENT:
      return Object.assign({}, state, {
        dm: {
          directMessages: state.dm.directMessages,
          connected: false,
          onlineUsers: state.dm.onlineUsers,
        },
      });

    default:
      return state;
  }
}
