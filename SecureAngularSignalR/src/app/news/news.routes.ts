import { RouterModule, Routes } from '@angular/router';

import { NewsComponent } from './components/news.component';

const routes: Routes = [{ path: 'news', component: NewsComponent }];

export const NewsRoutes = RouterModule.forChild(routes);
