import { Routes } from '@angular/router';
import { MasterProductParameterComponent } from './master-product-parameter.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

export const masterProduct: Routes = [
  {
    path: '',
    component: MasterProductParameterComponent,
    canActivate: [UserRouteAccessService],
  },
];
