import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFinancingRequest, FinancingRequest } from './financing-request.model';
import { FinancingRequestService } from './financing-request.service';
import { FinancingRequestComponent } from './financing-request.component';
import { FinancingRequestDetailComponent } from './financing-request-detail.component';
import { FinancingRequestUpdateComponent } from './financing-request-update.component';

@Injectable({ providedIn: 'root' })
export class FinancingRequestResolve implements Resolve<IFinancingRequest> {
  constructor(private service: FinancingRequestService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinancingRequest> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((financingRequest: HttpResponse<FinancingRequest>) => {
          if (financingRequest.body) {
            return of(financingRequest.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFinancingRequest>) => res.body),
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
    const newItem = new FinancingRequest();
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
    return of(newItem);
  }
}

export const financingRequestRoute: Routes = [
  {
    path: '',
    component: FinancingRequestComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.financingRequest.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinancingRequestDetailComponent,
    resolve: {
      financingRequest: FinancingRequestResolve,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      pageTitle: 'losgwApp.financingRequest.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinancingRequestUpdateComponent,
    resolve: {
      content: FinancingRequestResolve,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      pageTitle: 'losgwApp.financingRequest.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinancingRequestUpdateComponent,
    resolve: {
      content: FinancingRequestResolve,
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_CUSTOMER'],
      pageTitle: 'losgwApp.financingRequest.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
