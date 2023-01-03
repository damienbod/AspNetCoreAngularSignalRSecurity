import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as newsAction from './../store/news.action';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NewsState } from '../store/news.state';
import { NewsItem } from '../models/news-item';
import { Observable } from 'rxjs';
import * as fromSelectorsStore from '../store/news.selectors';
import { select } from '@ngrx/store';

@Component({
  selector: 'app-news-component',
  templateUrl: './news.component.html',
})
export class NewsComponent implements OnInit {
  public async: any;
  isAuthorized = false;
  newsItem: NewsItem;
  newsItemHeader = '';
  newsItemNewsText= '';
  group = 'IT';
  author = 'unknown';
  group$: Observable<string[]>;
  newsItems$: Observable<NewsItem[]>;

  constructor(
    private store: Store<any>,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.group$ = this.store.pipe(select(fromSelectorsStore.selectGroups));
    this.newsItems$ = this.store.pipe(
      select(fromSelectorsStore.selectNewsItems)
    );

    this.newsItem = new NewsItem();
    this.newsItem.AddData('', '', this.author, this.group);
  }

  public sendNewsItem(): void {

    this.newsItem = new NewsItem();
    this.newsItem.AddData(this.newsItemHeader, this.newsItemNewsText, this.author, this.group);

    this.store.dispatch(
      newsAction.sendNewsItemAction({ payload: this.newsItem })
    );
  }

  public join(): void {
    this.store.dispatch(newsAction.joinGroupAction({ payload: this.group }));
  }

  public leave(): void {
    this.store.dispatch(newsAction.leaveGroupAction({ payload: this.group }));
  }

  ngOnInit() {
    console.log('go');

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated}) => {
        this.isAuthorized = isAuthenticated;
        if (isAuthenticated) {
          console.log(
            'this.store.dispatch(new NewsActions.SelectAllGroupsAction()'
          );
          this.store.dispatch(newsAction.selectAllNewsGroupsAction());
        }
      }
    );

    console.log('IsAuthorized:' + this.isAuthorized);
  }
}
