import { NewsState } from './news.state';
import * as newsAction from './news.action';

export const initialState: NewsState = {
    news: {
        newsItems: [],
        groups: ['IT', 'global', 'sport']
    }
};

export function newsReducer(state = initialState, action: newsAction.Actions): NewsState {
    switch (action.type) {

        case newsAction.RECEIVED_GROUP_JOINED:
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems,
                    groups: (state.news.groups.indexOf(action.group) > -1) ? state.news.groups : state.news.groups.concat(action.group)
                }
            });

        case newsAction.RECEIVED_NEWS_ITEM:
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems.concat(action.newsItem),
                    groups: state.news.groups
                }
            });

        case newsAction.RECEIVED_GROUP_HISTORY:
            return Object.assign({}, state, {
                news: {
                    newsItems: action.newsItems,
                    groups: state.news.groups
                }
            });

        case newsAction.RECEIVED_GROUP_LEFT:
            const data = [];
            for (const entry of state.news.groups) {
                if (entry !== action.group) {
                    data.push(entry);
                }
            }
            console.log(data);
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems,
                    groups: data
                }
            });

        case newsAction.SELECTALL_GROUPS_COMPLETE:
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems,
                    groups: action.groups
                }
            });

        default:
            return state;

    }
}
