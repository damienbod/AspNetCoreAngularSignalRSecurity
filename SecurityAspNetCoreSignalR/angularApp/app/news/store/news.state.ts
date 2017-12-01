import { NewsItem } from '../models/news-item';
import { OnlineUser } from '../models/online-user';

export interface NewsState {
    newsItems: NewsItem[],
    groups: string[],
    onlineUsers: OnlineUser[]
};