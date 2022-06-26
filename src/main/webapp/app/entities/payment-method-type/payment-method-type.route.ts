import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPaymentMethodType, PaymentMethodType } from './payment-method-type.model';
import { PaymentMethodTypeService } from './payment-method-type.service';
import { PaymentMethodTypeComponent } from './payment-method-type.component';
import { PaymentMethodTypeDetailComponent } from './payment-method-type-detail.component';
import { PaymentMethodTypeUpdateComponent } from './payment-method-type-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentMethodTypeResolve implements Resolve<IPaymentMethodType> {
  constructor(private service: PaymentMethodTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentMethodType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentMethodType: HttpResponse<PaymentMethodType>) => {
          if (paymentMethodType.body) {
            return of(paymentMethodType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPaymentMethodType>) => res.body),
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
    const newItem = new PaymentMethodType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const defGLAccountId = route.queryParams['defGLAccountId'] ? route.queryParams['defGLAccountId'] : null;
    if (defGLAccountId) {
      newItem.defGLAccountId = defGLAccountId;
    }
    const accountTypeId = route.queryParams['accountTypeId'] ? route.queryParams['accountTypeId'] : null;
    if (accountTypeId) {
      newItem.accountTypeId = accountTypeId;
    }
    return of(newItem);
  }
}

export const paymentMethodTypeRoute: Routes = [
  {
    path: '',
    component: PaymentMethodTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.paymentMethodType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentMethodTypeDetailComponent,
    resolve: {
      paymentMethodType: PaymentMethodTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentMethodType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentMethodTypeUpdateComponent,
    resolve: {
      content: PaymentMethodTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentMethodType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentMethodTypeUpdateComponent,
    resolve: {
      content: PaymentMethodTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentMethodType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
