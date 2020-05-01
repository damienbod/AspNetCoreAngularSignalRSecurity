import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

    isAuthenticated$: Observable<boolean>;

    constructor(public oidcSecurityService: OidcSecurityService) {}

    ngOnInit() {
         this.isAuthenticated$ = this.oidcSecurityService.isAuthenticated$;
		 this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));
    }
}
