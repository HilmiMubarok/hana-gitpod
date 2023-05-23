import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterComplianceChecklistComponent } from './master-compliance-checklist.component';
import { Routes } from '@angular/router';

export const masterComplianceChecklistRoute: Routes = [
  {
    path: '',
    component: MasterComplianceChecklistComponent,
    canActivate: [UserRouteAccessService],
  },
];
