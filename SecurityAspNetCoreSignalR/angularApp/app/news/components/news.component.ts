import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { NewsState } from '../store/news.state';
import * as NewsActions from '../store/news.action';
import { NewsItem } from '../models/news-item';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-news-component',
    templateUrl: './news.component.html'
})

export class NewsComponent implements OnInit, OnDestroy {
    public async: any;
    newsItem: NewsItem;
    newsItems: NewsItem[] = [];
    group = 'IT';
    author = 'unknown';
    newsState$: Observable<NewsState>;
    groups = ['IT', 'global', 'sport'];

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(
        private store: Store<any>,
        private oidcSecurityService: OidcSecurityService
    ) {
        this.newsState$ = this.store.select<NewsState>(state => state.news.newsitems);

        this.store.select<NewsState>(state => state.news.newsitems).subscribe((o: NewsState) => {
            this.newsItems = o.newsItems;
        });

        this.newsItem = new NewsItem();
        this.newsItem.AddData('', '', this.author, this.group);
    }

    public sendNewsItem(): void {
        this.newsItem.newsGroup = this.group;
        this.newsItem.author = this.author;
        this.store.dispatch(new NewsActions.SendNewsItemAction(this.newsItem));
    }

    public join(): void {
        this.store.dispatch(new NewsActions.JoinGroupAction(this.group));
    }

    public leave(): void {
        this.store.dispatch(new NewsActions.LeaveGroupAction(this.group));
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
                if (this.isAuthorized) {
                    this.store.dispatch(new NewsActions.SelectAllGroupsAction());
                }
            });
        console.log('IsAuthorized:' + this.isAuthorized);
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }
}
