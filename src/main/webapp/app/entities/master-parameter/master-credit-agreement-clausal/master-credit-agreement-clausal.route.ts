import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterCreditAgreementClausalComponent } from './master-credit-agreement-clauasal.component';

export const masterCreditAgreementClausal: Routes = [
  {
    path: '',
    component: MasterCreditAgreementClausalComponent,
    canActivate: [UserRouteAccessService],
  },
];
