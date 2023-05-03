import { Routes } from '@angular/router';
import { CollateralParameterComponent } from './collateral-parameter.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const collateralParameterRoute: Routes = [
  {
    path: '',
    component: CollateralParameterComponent,
    canActivate: [UserRouteAccessService],
  },
];
