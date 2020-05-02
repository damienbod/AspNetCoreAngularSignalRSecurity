import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NewsState } from '../store/news.state';
import * as NewsActions from '../store/news.action';
import { NewsItem } from '../models/news-item';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-news-component',
    templateUrl: './news.component.html'
})

export class NewsComponent implements OnInit {
    public async: any;
    newsItem: NewsItem;
    newsItems: NewsItem[] = [];
    group = 'IT';
    author = 'unknown';
    newsState$: Observable<NewsState>;
    groups = ['IT', 'global', 'sport'];

    isAuthorized = false;

    constructor(
        private store: Store<any>,
        private oidcSecurityService: OidcSecurityService
    ) {
        this.newsState$ = this.store.select<NewsState>(state => state.news);

        this.store.select<NewsState>(state => state.news).subscribe((o: NewsState) => {
            console.log('event');
            console.log(o);
            this.newsItems = o.news.newsItems;
        });

        console.log(this.newsItems);
        this.newsItem = new NewsItem();
        this.newsItem.AddData('', '', this.author, this.group);
    }

    public sendNewsItem(): void {
        this.newsItem.newsGroup = this.group;
        this.newsItem.author = this.author;
        this.store.dispatch(new NewsActions.SendNewsItemAction(this.newsItem));
    }

    public join(): void {
        console.log('join');
        this.store.dispatch(new NewsActions.JoinGroupAction(this.group));
    }

    public leave(): void {
        this.store.dispatch(new NewsActions.LeaveGroupAction(this.group));
    }

    ngOnInit() {
		
		this.oidcSecurityService.isAuthenticated$.subscribe(
            (isAuthenticated: boolean) => {
				this.isAuthorized = isAuthenticated;
                if (isAuthenticated) {
                     console.log('this.store.dispatch(new NewsActions.SelectAllGroupsAction()');
                    this.store.dispatch(new NewsActions.SelectAllGroupsAction());
                }
            });

        console.log('IsAuthorized:' + this.isAuthorized);
    }
}
