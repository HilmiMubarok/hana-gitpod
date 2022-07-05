import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OrganizationLegalComponent } from '../list/organization-legal.component';
import { OrganizationLegalDetailComponent } from '../detail/organization-legal-detail.component';
import { OrganizationLegalUpdateComponent } from '../update/organization-legal-update.component';
import { OrganizationLegalRoutingResolveService } from './organization-legal-routing-resolve.service';

const organizationLegalRoute: Routes = [
  {
    path: '',
    component: OrganizationLegalComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganizationLegalDetailComponent,
    resolve: {
      organizationLegal: OrganizationLegalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganizationLegalUpdateComponent,
    resolve: {
      organizationLegal: OrganizationLegalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganizationLegalUpdateComponent,
    resolve: {
      organizationLegal: OrganizationLegalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(organizationLegalRoute)],
  exports: [RouterModule],
})
export class OrganizationLegalRoutingModule {}
