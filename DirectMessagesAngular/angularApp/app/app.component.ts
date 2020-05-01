import { Component, OnInit } from '@angular/core';

import { OidcSecurityService } from 'angular-auth-oidc-client';
import './app.component.css';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {

    title = '';
    email = '';

    isAuthorized = false;
    userData = false;

    constructor(public oidcSecurityService: OidcSecurityService) {}

    ngOnInit() {
		this.oidcSecurityService.isAuthenticated$.subscribe(
            (isAuthorized: boolean) => {
				this.isAuthorized = isAuthorized;
            });
			
		this.oidcSecurityService.userData$.subscribe(
            (userData: any) => {
                if (userData) {
                    this.email = userData.email;
                }

                console.log('userData getting data');
            });
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
}
