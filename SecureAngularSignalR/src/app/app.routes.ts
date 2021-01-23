import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'unauthorized', component: UnauthorizedComponent }
];

export const AppRoutes = RouterModule.forRoot(routes);
