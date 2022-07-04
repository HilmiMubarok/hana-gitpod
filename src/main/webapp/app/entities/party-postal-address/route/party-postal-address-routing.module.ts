import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PartyPostalAddressComponent } from '../list/party-postal-address.component';
import { PartyPostalAddressDetailComponent } from '../detail/party-postal-address-detail.component';
import { PartyPostalAddressUpdateComponent } from '../update/party-postal-address-update.component';
import { PartyPostalAddressRoutingResolveService } from './party-postal-address-routing-resolve.service';

const partyPostalAddressRoute: Routes = [
  {
    path: '',
    component: PartyPostalAddressComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyPostalAddressDetailComponent,
    resolve: {
      partyPostalAddress: PartyPostalAddressRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyPostalAddressUpdateComponent,
    resolve: {
      partyPostalAddress: PartyPostalAddressRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyPostalAddressUpdateComponent,
    resolve: {
      partyPostalAddress: PartyPostalAddressRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(partyPostalAddressRoute)],
  exports: [RouterModule],
})
export class PartyPostalAddressRoutingModule {}
