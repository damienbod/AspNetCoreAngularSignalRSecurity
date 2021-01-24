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
  on(
    directMessagesAction.receivedDirectMessageForUserAction,
    (state, { payload }) => {
      const directMessage: DirectMessage = {
        message: payload.message,
        fromOnlineUser: payload.onlineUser,
      };

      return {
        ...state,
        directMessages: [...state.directMessages, directMessage],
      };
    }
  ),
  on(
    directMessagesAction.sendDirectMessageActionFinished,
    (state, { payload }) => {
      const directMessage: DirectMessage = {
        message: payload,
        fromOnlineUser: null,
      };

      return {
        ...state,
        directMessages: [...state.directMessages, directMessage],
      };
    }
  ),
  on(directMessagesAction.receivedNewOnlineUserAction, (state, { payload }) => {
    return {
      ...state,
      onlineUsers: [...state.onlineUsers, payload],
    };
  }),
  on(directMessagesAction.receivedOnlineUsersAction, (state, { payload }) => {
    return {
      ...state,
      onlineUsers: [...payload],
    };
  }),
  on(directMessagesAction.joinActionFinished, (state, {}) => {
    return {
      ...state,
      connected: true,
    };
  }),
  on(directMessagesAction.leaveActionFinished, (state, {}) => {
    return {
      ...state,
      connected: false,
    };
  }),
  on(directMessagesAction.receivedUserLeftAction, (state, { payload }) => {
    const usersWithoutTheOneLeft = state.onlineUsers.filter(
      (x) => x.userName !== payload
    );
    return {
      ...state,
      onlineUsers: [...usersWithoutTheOneLeft],
    };
  })
);

export function directMessagesReducer(
  state: DirectMessagesState | undefined,
  action: Action
): DirectMessagesState {
  return directMessagesReducerInternal(state, action);
}
