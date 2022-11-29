import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';
import { MasterParameterIndustryLimitExposureComponent } from './industry-limit-exposure-parameter.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const INDUSTRY_LIMIT_EXPOSURE_PARAMETER_ROUTE: Routes = [
  {
    path: '',
    component: MasterParameterIndustryLimitExposureComponent,
    canActivate: [UserRouteAccessService],
  },
];
