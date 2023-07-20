import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { CorrectionApplicationComponent } from './correction-application.component';
import { CorrectionApplicationEditComponent } from './correction-application-edit.component';
import { RoleAdminAccessService } from 'app/core/auth/role-admin-access.service';

export const fixApplicationRoute: Routes = [
  {
    path: '',
    component: CorrectionApplicationComponent,
    canActivate: [UserRouteAccessService, RoleAdminAccessService],
  },
  {
    path: ':id/edit',
    component: CorrectionApplicationEditComponent,
    canActivate: [UserRouteAccessService, RoleAdminAccessService],
  },
];
