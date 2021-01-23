import { RouterModule, Routes } from '@angular/router';

import { ImagesComponent } from './components/images.component';

const routes: Routes = [{ path: 'images', component: ImagesComponent }];

export const ImagesRoutes = RouterModule.forChild(routes);
