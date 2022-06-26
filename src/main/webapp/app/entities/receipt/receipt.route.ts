import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IReceipt, Receipt } from './receipt.model';
import { ReceiptService } from './receipt.service';
import { ReceiptComponent } from './receipt.component';
import { ReceiptDetailComponent } from './receipt-detail.component';
import { ReceiptUpdateComponent } from './receipt-update.component';

@Injectable({ providedIn: 'root' })
export class ReceiptResolve implements Resolve<IReceipt> {
  constructor(private service: ReceiptService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IReceipt> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((receipt: HttpResponse<Receipt>) => {
          if (receipt.body) {
            return of(receipt.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IReceipt>) => res.body),
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
    const newItem = new Receipt();
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

export const receiptRoute: Routes = [
  {
    path: '',
    component: ReceiptComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.receipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReceiptDetailComponent,
    resolve: {
      receipt: ReceiptResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.receipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReceiptUpdateComponent,
    resolve: {
      content: ReceiptResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.receipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReceiptUpdateComponent,
    resolve: {
      content: ReceiptResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.receipt.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
