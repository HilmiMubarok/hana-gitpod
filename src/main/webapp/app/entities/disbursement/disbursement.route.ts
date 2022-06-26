import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IDisbursement, Disbursement } from './disbursement.model';
import { DisbursementService } from './disbursement.service';
import { DisbursementComponent } from './disbursement.component';
import { DisbursementDetailComponent } from './disbursement-detail.component';
import { DisbursementUpdateComponent } from './disbursement-update.component';

@Injectable({ providedIn: 'root' })
export class DisbursementResolve implements Resolve<IDisbursement> {
  constructor(private service: DisbursementService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDisbursement> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((disbursement: HttpResponse<Disbursement>) => {
          if (disbursement.body) {
            return of(disbursement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IDisbursement>) => res.body),
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
    const newItem = new Disbursement();
    const paymentTypeId = route.queryParams['paymentTypeId'] ? route.queryParams['paymentTypeId'] : null;
    if (paymentTypeId) {
      newItem.paymentTypeId = paymentTypeId;
    }
    const paymentMethodId = route.queryParams['paymentMethodId'] ? route.queryParams['paymentMethodId'] : null;
    if (paymentMethodId) {
      newItem.paymentMethodId = paymentMethodId;
    }
    const accountTransId = route.queryParams['accountTransId'] ? route.queryParams['accountTransId'] : null;
    if (accountTransId) {
      newItem.accountTransId = accountTransId;
    }
    const acctgTransId = route.queryParams['acctgTransId'] ? route.queryParams['acctgTransId'] : null;
    if (acctgTransId) {
      newItem.acctgTransId = acctgTransId;
    }
    const paidFromId = route.queryParams['paidFromId'] ? route.queryParams['paidFromId'] : null;
    if (paidFromId) {
      newItem.paidFromId = paidFromId;
    }
    const paidToId = route.queryParams['paidToId'] ? route.queryParams['paidToId'] : null;
    if (paidToId) {
      newItem.paidToId = paidToId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const disbursementRoute: Routes = [
  {
    path: '',
    component: DisbursementComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.disbursement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DisbursementDetailComponent,
    resolve: {
      disbursement: DisbursementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.disbursement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DisbursementUpdateComponent,
    resolve: {
      content: DisbursementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.disbursement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DisbursementUpdateComponent,
    resolve: {
      content: DisbursementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.disbursement.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
