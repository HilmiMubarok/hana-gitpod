import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPartyPaymentPref, PartyPaymentPref } from './party-payment-pref.model';
import { PartyPaymentPrefService } from './party-payment-pref.service';
import { PartyPaymentPrefComponent } from './party-payment-pref.component';
import { PartyPaymentPrefDetailComponent } from './party-payment-pref-detail.component';
import { PartyPaymentPrefUpdateComponent } from './party-payment-pref-update.component';

@Injectable({ providedIn: 'root' })
export class PartyPaymentPrefResolve implements Resolve<IPartyPaymentPref> {
  constructor(private service: PartyPaymentPrefService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyPaymentPref> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyPaymentPref: HttpResponse<PartyPaymentPref>) => {
          if (partyPaymentPref.body) {
            return of(partyPaymentPref.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyPaymentPref>) => res.body),
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
    const newItem = new PartyPaymentPref();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const paymentMethodTypeId = route.queryParams['paymentMethodTypeId'] ? route.queryParams['paymentMethodTypeId'] : null;
    if (paymentMethodTypeId) {
      newItem.paymentMethodTypeId = paymentMethodTypeId;
    }
    const providerId = route.queryParams['providerId'] ? route.queryParams['providerId'] : null;
    if (providerId) {
      newItem.providerId = providerId;
    }
    return of(newItem);
  }
}

export const partyPaymentPrefRoute: Routes = [
  {
    path: '',
    component: PartyPaymentPrefComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyPaymentPref.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyPaymentPrefDetailComponent,
    resolve: {
      partyPaymentPref: PartyPaymentPrefResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyPaymentPref.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyPaymentPrefUpdateComponent,
    resolve: {
      content: PartyPaymentPrefResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyPaymentPref.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyPaymentPrefUpdateComponent,
    resolve: {
      content: PartyPaymentPrefResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyPaymentPref.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
