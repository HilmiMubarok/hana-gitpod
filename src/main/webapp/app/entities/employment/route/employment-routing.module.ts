import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmploymentComponent } from '../list/employment.component';
import { EmploymentDetailComponent } from '../detail/employment-detail.component';
import { EmploymentUpdateComponent } from '../update/employment-update.component';
import { EmploymentRoutingResolveService } from './employment-routing-resolve.service';

const employmentRoute: Routes = [
  {
    path: '',
    component: EmploymentComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmploymentDetailComponent,
    resolve: {
      employment: EmploymentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmploymentUpdateComponent,
    resolve: {
      employment: EmploymentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmploymentUpdateComponent,
    resolve: {
      employment: EmploymentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(employmentRoute)],
  exports: [RouterModule],
})
export class EmploymentRoutingModule {}
