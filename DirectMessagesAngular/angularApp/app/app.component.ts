import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import './app.component.css';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit, OnDestroy {

    title = '';
    email = '';

    isAuthorizedSubscription: Subscription | undefined;
    isAuthorized = false;
    userDataSubscription: Subscription | undefined;
    userData = false;

    constructor(
        public oidcSecurityService: OidcSecurityService
    ) {
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

        this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(
            (userData: any) => {
                if (userData && userData !== '') {
                    this.email = userData.email;
                }
            });
    }

    ngOnDestroy(): void {
		if(this.isAuthorizedSubscription) {
        this.isAuthorizedSubscription.unsubscribe();
		}
        this.oidcSecurityService.onModuleSetup.unsubscribe();
		if(this.userDataSubscription) {
			this.userDataSubscription.unsubscribe();
		}
    }

    login() {
        console.log('start login');
        this.oidcSecurityService.authorize();
    }

    refreshSession() {
        console.log('start refreshSession');
        this.oidcSecurityService.authorize();
    }

    logout() {
        console.log('start logoff');
        this.oidcSecurityService.logoff();
    }

    private doCallbackLogicIfRequired() {
        if (window.location.hash) {
            this.oidcSecurityService.authorizedCallback();
        }
    }
}
