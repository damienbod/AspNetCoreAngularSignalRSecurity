import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DirectMessagesState } from './directmessages.state';

export const directMessageStoreName = 'dm';

export const selectDirectMessageStore = createFeatureSelector(directMessageStoreName);

export const selectDirectMessages = createSelector(
  selectDirectMessageStore,
  (state: DirectMessagesState) => state.directMessages
);

export const selectOnlineUsers = createSelector(
  selectDirectMessageStore,
  (state: DirectMessagesState) => state.onlineUsers
);

export const selectConnected = createSelector(
  selectDirectMessageStore,
  (state: DirectMessagesState) => state.connected
);

