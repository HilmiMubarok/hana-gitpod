import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
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
];
