import { NewsState } from './news.state';
import * as newsAction from './news.action';

export const initialState: NewsState = {
    newsItems: [],
    groups: ['IT', 'global', 'sport'],
    onlineUsers: []
};

export function newsReducer(state = initialState, action: newsAction.Actions): NewsState {
    switch (action.type) {

        case newsAction.RECEIVED_GROUP_JOINED:
            return Object.assign({}, state, {
                groups: (state.groups.indexOf(action.group) > -1) ? state.groups : state.groups.concat(action.group)
            });

        case newsAction.RECEIVED_NEWS_ITEM:
            return Object.assign({}, state, {
                newsItems: state.newsItems.concat(action.newsItem),
            });

        case newsAction.RECEIVED_GROUP_HISTORY:
            return Object.assign({}, state, {
                newsItems: action.newsItems,
            });

        case newsAction.RECEIVED_GROUP_LEFT:
            const data = [];
            for (const entry of state.groups) {
                if (entry !== action.group) {
                    data.push(entry);
                }
            }
            console.log(data);
            return Object.assign({}, state, {
                groups: data
            });

        case newsAction.SELECTALL_GROUPS_COMPLETE:
            return Object.assign({}, state, {
                groups: action.groups
            });

        default:
            return state;

    }
}
