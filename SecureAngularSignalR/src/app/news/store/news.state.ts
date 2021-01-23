import { NewsItem } from '../models/news-item';

export interface NewsState {
  newsItems: NewsItem[];
  groups: string[];
}
