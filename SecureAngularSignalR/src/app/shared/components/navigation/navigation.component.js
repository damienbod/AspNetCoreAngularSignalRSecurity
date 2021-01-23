var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
import { OidcSecurityService } from "angular-auth-oidc-client";
import { Component } from "@angular/core";
let NavigationComponent = class NavigationComponent {
  constructor(oidcSecurityService) {
    this.oidcSecurityService = oidcSecurityService;
    this.hasAdminRole = false;
    this.hasDataEventRecordsAdminRole = false;
    this.isAuthorized = false;
  }
  ngOnInit() {
    this.oidcSecurityService.isAuthenticated$.subscribe((isAuthorized) => {
      this.isAuthorized = isAuthorized;
      if (isAuthorized) {
        console.log("isAuthorized getting data");
      }
    });
    this.oidcSecurityService.userData$.subscribe((userData) => {
      if (userData && userData !== "" && userData.role) {
        for (let i = 0; i < userData.role.length; i++) {
          if (userData.role[i] === "dataEventRecords.admin") {
            this.hasDataEventRecordsAdminRole = true;
          }
          if (userData.role[i] === "admin") {
            this.hasAdminRole = true;
          }
        }
      }
      console.log("userData getting data");
    });
  }
  login() {
    console.log("Do login logic");
    this.oidcSecurityService.authorize();
  }
  logout() {
    console.log("Do logout logic");
    this.oidcSecurityService.logoff();
  }
};
NavigationComponent = __decorate(
  [
    Component({
      selector: "app-navigation",
      templateUrl: "navigation.component.html",
    }),
    __metadata("design:paramtypes", [OidcSecurityService]),
  ],
  NavigationComponent
);
export { NavigationComponent };
//# sourceMappingURL=navigation.component.js.map
