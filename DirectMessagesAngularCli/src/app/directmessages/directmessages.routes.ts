import { RouterModule, Routes } from '@angular/router';

import { DirectMessagesComponent } from './components/direct-message.component';

const routes: Routes = [{ path: '', component: DirectMessagesComponent }];

export const DirectMessagesRoutes = RouterModule.forChild(routes);
