import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { NewsState } from '../store/news.state';
import * as NewsActions from '../store/news.action';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { OnlineUser } from '../models/online-user';
import { DirectMessage } from '../models/direct-message';

@Component({
    selector: 'app-direct-message-component',
    templateUrl: './direct-message.component.html'
})

export class DirectMessageComponent implements OnInit, OnDestroy {
    public async: any;
    onlineUsers: OnlineUser[];
    onlineUser: OnlineUser;
    directMessages: DirectMessage[];
    message = 'message';
    newsState$: Observable<NewsState>;

    isAuthorizedSubscription: Subscription;
    isAuthorized: boolean;

    constructor(
        private store: Store<any>,
        private oidcSecurityService: OidcSecurityService
    ) {
        this.newsState$ = this.store.select<NewsState>(state => state.news.newsitems);
    }

    public send(): void {
        this.store.dispatch(new NewsActions.SendDirectMessageAction(this.message, this.onlineUser.id));
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
                if (this.isAuthorized) {
                }
            });
        console.log('IsAuthorized:' + this.isAuthorized);
    }

    ngOnDestroy(): void {
        this.isAuthorizedSubscription.unsubscribe();
    }
}
