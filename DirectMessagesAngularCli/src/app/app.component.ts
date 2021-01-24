import { Component, OnInit } from '@angular/core';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = '';
  email = '';

  isAuthorized = false;
  userData = false;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((isAuthenticated) =>
        console.log('app authenticated', isAuthenticated)
      );
    this.oidcSecurityService.isAuthenticated$.subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
      }
    );

    this.oidcSecurityService.userData$.subscribe((userData: any) => {
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
