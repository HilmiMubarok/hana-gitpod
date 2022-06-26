import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBill, Bill } from './bill.model';
import { BillService } from './bill.service';
import { BillComponent } from './bill.component';
import { BillDetailComponent } from './bill-detail.component';
import { BillUpdateComponent } from './bill-update.component';

@Injectable({ providedIn: 'root' })
export class BillResolve implements Resolve<IBill> {
  constructor(private service: BillService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBill> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bill: HttpResponse<Bill>) => {
          if (bill.body) {
            return of(bill.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBill>) => res.body),
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
    const newItem = new Bill();
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

export const billRoute: Routes = [
  {
    path: '',
    component: BillComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillDetailComponent,
    resolve: {
      bill: BillResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillUpdateComponent,
    resolve: {
      content: BillResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillUpdateComponent,
    resolve: {
      content: BillResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.bill.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
