import { RouterModule, Routes } from '@angular/router';
import { DATA_RECORDS_ROUTES } from './dataeventrecords/dataeventrecords.routes';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full',
        ...DATA_RECORDS_ROUTES,
    }
];

export const AppRoutes = RouterModule.forRoot(routes);
