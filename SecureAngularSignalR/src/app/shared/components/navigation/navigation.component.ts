import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
})
export class NavigationComponent implements OnInit {
  hasAdminRole = false;
  hasDataEventRecordsAdminRole = false;
  isAuthorized = false;
  userData: any;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit() {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      (isAuthorized: boolean) => {
        this.isAuthorized = isAuthorized;
        if (isAuthorized) {
          console.log('isAuthorized getting data');
        }
      }
    );

    this.oidcSecurityService.userData$.subscribe((userData: any) => {
      if (userData && userData !== '' && userData.role) {
        for (let i = 0; i < userData.role.length; i++) {
          if (userData.role[i] === 'dataEventRecords.admin') {
            this.hasDataEventRecordsAdminRole = true;
          }
          if (userData.role[i] === 'admin') {
            this.hasAdminRole = true;
          }
        }
      }

      console.log('userData getting data');
    });
  }

  login() {
    console.log('Do login logic');
    this.oidcSecurityService.authorize();
  }

  logout() {
    console.log('Do logout logic');
    this.oidcSecurityService.logoff();
  }
}
