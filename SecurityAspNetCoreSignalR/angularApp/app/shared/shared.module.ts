import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomFooterComponent } from './components/customfooter/customfooter.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],

    declarations: [
        NavigationComponent,
        CustomFooterComponent,
        UnauthorizedComponent
    ],

    exports: [
        NavigationComponent,
        CustomFooterComponent,
        UnauthorizedComponent
    ]
})

export class SharedModule { }
