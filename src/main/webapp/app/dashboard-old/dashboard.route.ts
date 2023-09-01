import { Route } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const DASHBOARD_ROUTE: Route = {
  path: 'dashboard',
  component: DashboardComponent,
  data: {
    pageTitle: 'Credit Approval System of Hana Bank',
  },
  canActivate: [UserRouteAccessService],
};
