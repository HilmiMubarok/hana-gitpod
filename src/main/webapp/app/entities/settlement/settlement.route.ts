import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ISettlement, Settlement } from './settlement.model';
import { SettlementService } from './settlement.service';
import { SettlementComponent } from './settlement.component';
import { SettlementDetailComponent } from './settlement-detail.component';
import { SettlementUpdateComponent } from './settlement-update.component';

@Injectable({ providedIn: 'root' })
export class SettlementResolve implements Resolve<ISettlement> {
  constructor(private service: SettlementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISettlement> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((settlement: HttpResponse<Settlement>) => {
          if (settlement.body) {
            return of(settlement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ISettlement>) => res.body),
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
    const newItem = new Settlement();
    const settlementTypeId = route.queryParams['settlementTypeId'] ? route.queryParams['settlementTypeId'] : null;
    if (settlementTypeId) {
      newItem.settlementTypeId = settlementTypeId;
    }
    const paymentMethodId = route.queryParams['paymentMethodId'] ? route.queryParams['paymentMethodId'] : null;
    if (paymentMethodId) {
      newItem.paymentMethodId = paymentMethodId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const settlementRoute: Routes = [
  {
    path: '',
    component: SettlementComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.settlement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SettlementDetailComponent,
    resolve: {
      settlement: SettlementResolve,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      pageTitle: 'losgwApp.settlement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SettlementUpdateComponent,
    resolve: {
      content: SettlementResolve,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      pageTitle: 'losgwApp.settlement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SettlementUpdateComponent,
    resolve: {
      content: SettlementResolve,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      pageTitle: 'losgwApp.settlement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
