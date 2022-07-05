import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CifComponent } from '../list/cif.component';
import { CifDetailComponent } from '../detail/cif-detail.component';
import { CifUpdateComponent } from '../update/cif-update.component';
import { CifRoutingResolveService } from './cif-routing-resolve.service';

const cifRoute: Routes = [
  {
    path: '',
    component: CifComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CifDetailComponent,
    resolve: {
      cif: CifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CifUpdateComponent,
    resolve: {
      cif: CifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CifUpdateComponent,
    resolve: {
      cif: CifRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(cifRoute)],
  exports: [RouterModule],
})
export class CifRoutingModule {}
