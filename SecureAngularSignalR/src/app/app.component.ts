import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticatedResult, OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<AuthenticatedResult>;

  constructor(public oidcSecurityService: OidcSecurityService) {
    this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
  }

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((isAuthenticated) =>
        console.log('app authenticated', isAuthenticated)
      );
  }
}
