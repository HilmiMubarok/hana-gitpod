import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SampleFormNestedComponent } from './sample-form-nested.component';
import { SampleFormComponent } from './sample-form.component';

export const sampleFormRoute: Routes = [
  {
    path: '',
    component: SampleFormComponent,
    data: {
      authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'nested',
    component: SampleFormNestedComponent,
    data: {
      authorities: ['ROLE_USER', 'ROLE_ADMIN'],
    },
    canActivate: [UserRouteAccessService],
  },
];
