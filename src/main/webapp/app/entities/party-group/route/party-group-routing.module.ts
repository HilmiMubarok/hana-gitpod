import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PartyGroupComponent } from '../list/party-group.component';
import { PartyGroupDetailComponent } from '../detail/party-group-detail.component';
import { PartyGroupUpdateComponent } from '../update/party-group-update.component';
import { PartyGroupRoutingResolveService } from './party-group-routing-resolve.service';

const partyGroupRoute: Routes = [
  {
    path: '',
    component: PartyGroupComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyGroupDetailComponent,
    resolve: {
      partyGroup: PartyGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyGroupUpdateComponent,
    resolve: {
      partyGroup: PartyGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyGroupUpdateComponent,
    resolve: {
      partyGroup: PartyGroupRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(partyGroupRoute)],
  exports: [RouterModule],
})
export class PartyGroupRoutingModule {}
