import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationFinancialComponent } from '../list/organization-financial.component';
import { OrganizationFinancialDetailComponent } from '../detail/organization-financial-detail.component';
import { OrganizationFinancialUpdateComponent } from '../update/organization-financial-update.component';
import { OrganizationFinancialRoutingResolveService } from './organization-financial-routing-resolve.service';

const organizationFinancialRoute: Routes = [
  {
    path: '',
    component: OrganizationFinancialComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationFinancialDetailComponent,
    resolve: {
      organizationFinancial: OrganizationFinancialRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationFinancialUpdateComponent,
    resolve: {
      organizationFinancial: OrganizationFinancialRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationFinancialUpdateComponent,
    resolve: {
      organizationFinancial: OrganizationFinancialRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationFinancialRoute)],
  exports: [RouterModule],
})
export class OrganizationFinancialRoutingModule {}
