import { Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MasterLovParameterComponent } from './master-lov-parameter.component';

export const MASTER_LOV_PARAMETER: Routes = [
  {
    path: '',
    component: MasterLovParameterComponent,
    canActivate: [UserRouteAccessService],
  },
];
