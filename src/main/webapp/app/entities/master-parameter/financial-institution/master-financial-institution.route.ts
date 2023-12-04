import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterFinancialInstitutionComponent } from './master-financial-institution.component';

export const masterFinancialInstitutionRoute: Routes = [
  {
    path: '',
    component: MasterFinancialInstitutionComponent,
    canActivate: [UserRouteAccessService],
  },
];
