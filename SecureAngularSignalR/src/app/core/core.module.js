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
var CoreModule_1;
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { Configuration } from "../app.constants";
let CoreModule = (CoreModule_1 = class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule_1,
      providers: [Configuration],
    };
  }
});
CoreModule = CoreModule_1 = __decorate(
  [
    NgModule({
      imports: [CommonModule],
    }),
  ],
  CoreModule
);
export { CoreModule };
//# sourceMappingURL=core.module.js.map
