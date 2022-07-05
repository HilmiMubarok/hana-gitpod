import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationManagementComponent } from '../list/organization-management.component';
import { OrganizationManagementDetailComponent } from '../detail/organization-management-detail.component';
import { OrganizationManagementUpdateComponent } from '../update/organization-management-update.component';
import { OrganizationManagementRoutingResolveService } from './organization-management-routing-resolve.service';

const organizationManagementRoute: Routes = [
  {
    path: '',
    component: OrganizationManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationManagementDetailComponent,
    resolve: {
      organizationManagement: OrganizationManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationManagementUpdateComponent,
    resolve: {
      organizationManagement: OrganizationManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationManagementUpdateComponent,
    resolve: {
      organizationManagement: OrganizationManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationManagementRoute)],
  exports: [RouterModule],
})
export class OrganizationManagementRoutingModule {}
