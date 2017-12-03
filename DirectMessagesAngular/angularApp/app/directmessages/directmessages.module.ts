import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DirectMessagesService } from './directmessages.service';

import { DirectMessagesComponent } from './components/direct-message.component'
import { DirectMessagesRoutes } from './directmessages.routes';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DirectMessagesEffects } from './store/directmessages.effects';
import { directMessagesReducer } from './store/directmessages.reducer';
import * as directMessagesAction from './store/directmessages.action';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        DirectMessagesRoutes,
        StoreModule.forFeature('dm', {
            dm: directMessagesReducer, directMessagesAction
        }),
        EffectsModule.forFeature([DirectMessagesEffects])
    ],

    declarations: [
        DirectMessagesComponent
    ],

    providers: [
        DirectMessagesService
    ],

    exports: [
        DirectMessagesComponent
    ]
})

export class NewsModule { }
