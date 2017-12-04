import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'unauthorized', component: UnauthorizedComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
