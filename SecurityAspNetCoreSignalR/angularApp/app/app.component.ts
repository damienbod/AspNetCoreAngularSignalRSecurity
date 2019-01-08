import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpParams } from '@angular/common/http';


@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;

    constructor(public oidcSecurityService: OidcSecurityService) {
        if (this.oidcSecurityService.moduleSetup) {
            this.doCallbackLogicIfRequired();
        } else {
            this.oidcSecurityService.onModuleSetup.subscribe(() => {
                this.doCallbackLogicIfRequired();
            });
        }
    }

    ngOnInit() {
        this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
            (isAuthorized: boolean) => {
                this.isAuthorized = isAuthorized;
            });
    }

    ngOnDestroy(): void {
        if (this.isAuthorizedSubscription) {
            this.isAuthorizedSubscription.unsubscribe();
        }
    }

    //private doCallbackLogicIfRequired() {
    //    console.log(window.location);
    //    // Will do a callback, if the url has a code and state parameter.
    //    this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
    //}

    private doCallbackLogicIfRequired() {
        console.log(window.location);

        const urlParts = window.location.toString().split('?');
        const params = new HttpParams({
            fromString: urlParts[1]
        });
        const code = params.get('code');
        const state = params.get('state');
        const session_state = params.get('session_state');

        if (code && state && session_state) {
            this.oidcSecurityService.requestTokensWithCode(code, state, session_state);
        }
    }
}
