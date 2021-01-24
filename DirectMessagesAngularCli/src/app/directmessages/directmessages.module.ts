import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DirectMessagesService } from './directmessages.service';

import { DirectMessagesComponent } from './components/direct-message.component';
import { DirectMessagesRoutes } from './directmessages.routes';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DirectMessagesEffects } from './store/directmessages.effects';
import { directMessagesReducer } from './store/directmessages.reducer';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { directMessageStoreName } from './store/directmessages.selectors';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DirectMessagesRoutes,
    StoreModule.forFeature(directMessageStoreName, directMessagesReducer),
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
})
export class DirectMessagesModule {}
