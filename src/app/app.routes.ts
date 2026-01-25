import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { LayoutComponent } from './components/layout/layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { UsersComponent } from './components/users/users';
import { OrdersComponent } from './components/orders/orders';
import { ProjectsComponent } from './components/projects/projects';
import { PlansComponent } from './components/plans/plans';
import { ContentComponent } from './components/content/content';
import { SettingsComponent } from './components/settings/settings';
import { OrderDetailComponent } from './components/orders/order-detail';
import { ReviewsComponent } from './components/reviews/reviews';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'order-detail/:id', component: OrderDetailComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'content', component: ContentComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
