import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TestRoutes } from './test.routes';
import { TestComponent } from './components/test-component/test.component';
import { Module1DialogComponent } from './components/module1-dialog-component/module1-dialog.component';
import { CustomMaterialModule } from '../custom-material-module';
import { CompDialogComponent } from './components/comp-dialog-component/comp-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        CustomMaterialModule,
        TestRoutes
    ],

    declarations: [
        TestComponent,
        Module1DialogComponent,
        CompDialogComponent
    ],
    entryComponents: [
        Module1DialogComponent,
        CompDialogComponent
    ],
})

export class TestModule { }
