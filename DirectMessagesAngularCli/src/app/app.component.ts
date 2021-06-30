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

  ngOnInit(): void {

    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken }) => {
      console.log('app authenticated', isAuthenticated);
      this.isAuthorized = isAuthenticated;
      console.log(`Current access token is '${accessToken}'`);
    });

    this.oidcSecurityService.userData$.subscribe((userData: any) => {
      if (userData) {
        this.email = userData.email;
      }

      console.log('userData getting data');
    });
  }

  login(): void {
    console.log('start login');
    this.oidcSecurityService.authorize();
  }

  refreshSession(): void {
    console.log('start refreshSession');
    this.oidcSecurityService.authorize();
  }

  logout(): void {
    console.log('start logoff');
    this.oidcSecurityService.logoff();
  }
}
