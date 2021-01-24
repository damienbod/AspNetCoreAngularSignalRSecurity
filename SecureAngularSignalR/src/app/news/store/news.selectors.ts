import { NewsState } from './news.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const newsStoreName = 'news';

export const selectNewsStore = createFeatureSelector<NewsState>(newsStoreName);

export const selectNewsItems = createSelector(
  selectNewsStore,
  (state: NewsState) => state.newsItems
);

export const selectGroups = createSelector(
  selectNewsStore,
  (state: NewsState) => state.groups
);
