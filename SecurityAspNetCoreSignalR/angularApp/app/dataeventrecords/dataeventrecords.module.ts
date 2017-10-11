import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataEventRecordsService } from './dataeventrecords.service';
import { DataEventRecordsListComponent } from './components/dataeventrecords-list.component';
import { DataEventRecordsCreateComponent } from './components/dataeventrecords-create.component';
import { DataEventRecordsEditComponent } from './components/dataeventrecords-edit.component';
import { DATA_RECORDS_ROUTES } from './dataeventrecords.routes';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        DATA_RECORDS_ROUTES
    ],

    declarations: [
        DataEventRecordsListComponent,
        DataEventRecordsCreateComponent,
        DataEventRecordsEditComponent
    ],

    providers: [
        DataEventRecordsService
    ],

    exports: [
        DataEventRecordsListComponent,
        DataEventRecordsCreateComponent,
        DataEventRecordsEditComponent
    ]
})

export class DataEventRecordsModule { }
