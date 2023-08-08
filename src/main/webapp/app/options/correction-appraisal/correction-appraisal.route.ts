import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { RoleAdminAccessService } from 'app/core/auth/role-admin-access.service';
import { CorrectionAppraisalComponent } from './correction-appraisal.component';
import { CorrectionAppraisalEditComponent } from './correction-appraisal-edit.component';

export const correctionAppraisalRoute: Routes = [
  {
    path: '',
    component: CorrectionAppraisalComponent,
    canActivate: [UserRouteAccessService, RoleAdminAccessService],
  },
  {
    path: ':id/edit',
    component: CorrectionAppraisalEditComponent,
    canActivate: [UserRouteAccessService, RoleAdminAccessService],
  },
];
