import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterCompanyTypeComponent } from './master-company-type.component';

export const masterCompanyType: Routes = [
  {
    path: '',
    component: MasterCompanyTypeComponent,
    canActivate: [UserRouteAccessService],
  },
];
