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
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DirectMessagesService } from "./directmessages.service";
import { DirectMessagesComponent } from "./components/direct-message.component";
import { DirectMessagesRoutes } from "./directmessages.routes";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { DirectMessagesEffects } from "./store/directmessages.effects";
import { directMessagesReducer } from "./store/directmessages.reducer";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatListModule } from "@angular/material/list";
let DirectMessagesModule = class DirectMessagesModule {};
DirectMessagesModule = __decorate(
  [
    NgModule({
      imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        DirectMessagesRoutes,
        StoreModule.forFeature("dm", directMessagesReducer),
        EffectsModule.forFeature([DirectMessagesEffects]),
        MatListModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        FlexLayoutModule,
        MatChipsModule,
      ],
      declarations: [DirectMessagesComponent],
      providers: [DirectMessagesService],
      exports: [DirectMessagesComponent],
    }),
  ],
  DirectMessagesModule
);
export { DirectMessagesModule };
//# sourceMappingURL=directmessages.module.js.map
