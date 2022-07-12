import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyPostalAddress, PartyPostalAddress } from './party-postal-address.model';
import { PartyPostalAddressService } from './party-postal-address.service';
import { PartyPostalAddressComponent } from './party-postal-address.component';
import { PartyPostalAddressDetailComponent } from './party-postal-address-detail.component';
import { PartyPostalAddressUpdateComponent } from './party-postal-address-update.component';

@Injectable({ providedIn: 'root' })
export class PartyPostalAddressResolve implements Resolve<IPartyPostalAddress> {
  constructor(private service: PartyPostalAddressService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyPostalAddress> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyPostalAddress: HttpResponse<PartyPostalAddress>) => {
          if (partyPostalAddress.body) {
            return of(partyPostalAddress.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyPostalAddress>) => res.body),
        mergeMap(res => {
          if (res) {
            return of(res);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    const newItem = new PartyPostalAddress();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const addressId = route.queryParams['addressId'] ? route.queryParams['addressId'] : null;
    if (addressId) {
      newItem.addressId = addressId;
    }
    const purposeTypeId = route.queryParams['purposeTypeId'] ? route.queryParams['purposeTypeId'] : null;
    if (purposeTypeId) {
      newItem.purposeTypeId = purposeTypeId;
    }
    return of(newItem);
  }
}

export const partyPostalAddressRoute: Routes = [
  {
    path: '',
    component: PartyPostalAddressComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyPostalAddress.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyPostalAddressDetailComponent,
    resolve: {
      partyPostalAddress: PartyPostalAddressResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyPostalAddress.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyPostalAddressUpdateComponent,
    resolve: {
      content: PartyPostalAddressResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyPostalAddress.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyPostalAddressUpdateComponent,
    resolve: {
      content: PartyPostalAddressResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyPostalAddress.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
