import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterParameterLegalLendingLimitComponent } from './legal-lending-limit-parameter.component';

export const LEGAL_LENDING_LIMIT_PARAMETER_ROUTE: Routes = [
  {
    path: '',
    component: MasterParameterLegalLendingLimitComponent,
    canActivate: [UserRouteAccessService],
  },
];
