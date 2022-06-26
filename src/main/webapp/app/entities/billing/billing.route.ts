import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBilling, Billing } from './billing.model';
import { BillingService } from './billing.service';
import { BillingComponent } from './billing.component';
import { BillingDetailComponent } from './billing-detail.component';
import { BillingUpdateComponent } from './billing-update.component';

@Injectable({ providedIn: 'root' })
export class BillingResolve implements Resolve<IBilling> {
  constructor(private service: BillingService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBilling> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billing: HttpResponse<Billing>) => {
          if (billing.body) {
            return of(billing.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBilling>) => res.body),
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
    const newItem = new Billing();
    const billingTypeId = route.queryParams['billingTypeId'] ? route.queryParams['billingTypeId'] : null;
    if (billingTypeId) {
      newItem.billingTypeId = billingTypeId;
    }
    const acctgTransId = route.queryParams['acctgTransId'] ? route.queryParams['acctgTransId'] : null;
    if (acctgTransId) {
      newItem.acctgTransId = acctgTransId;
    }
    const settlementId = route.queryParams['settlementId'] ? route.queryParams['settlementId'] : null;
    if (settlementId) {
      newItem.settlementId = settlementId;
    }
    const billFromId = route.queryParams['billFromId'] ? route.queryParams['billFromId'] : null;
    if (billFromId) {
      newItem.billFromId = billFromId;
    }
    const billToId = route.queryParams['billToId'] ? route.queryParams['billToId'] : null;
    if (billToId) {
      newItem.billToId = billToId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const billingRoute: Routes = [
  {
    path: '',
    component: BillingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.billing.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingDetailComponent,
    resolve: {
      billing: BillingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billing.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingUpdateComponent,
    resolve: {
      content: BillingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billing.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingUpdateComponent,
    resolve: {
      content: BillingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billing.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
