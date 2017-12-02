import { NewsItem } from '../models/news-item';
import { OnlineUser } from '../models/online-user';
import { DirectMessage } from '../models/direct-message';

export interface NewsState {
    newsItems: NewsItem[],
    groups: string[],
    onlineUsers: OnlineUser[],
    directMessages: DirectMessage[]
};