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
      ({isAuthenticated}) => {
        this.isAuthorized = isAuthenticated;
        if (isAuthenticated) {
          console.log('isAuthorized getting data');
        }
      }
    );

    this.oidcSecurityService.userData$.subscribe(({userData}) => {
      if (userData && userData !== '' && userData.role) {
        this.hasDataEventRecordsAdminRole = userData.role.every(
          (row) => row === 'dataEventRecords.admin'
        );

        this.hasAdminRole = userData.role.every((row) => row === 'admin');
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
