import { RouterModule, Routes } from '@angular/router';
import { TestComponent } from './components/test-component/test.component';

const routes: Routes = [
    { path: '', component: TestComponent }
];

export const TestRoutes = RouterModule.forChild(routes);
