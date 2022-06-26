import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SampleEjsSidebarComponent } from './sample-ejs-sidebar.component';
import { SampleEjsComponent } from './sample-ejs.component';

export const sampleEjsRoute: Routes = [
  {
    path: '',
    component: SampleEjsComponent,
    data: {
      authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'sidebar',
    component: SampleEjsSidebarComponent,
    data: {
      authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
