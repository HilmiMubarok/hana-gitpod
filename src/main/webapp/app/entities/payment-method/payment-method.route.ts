import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPaymentMethod, PaymentMethod } from './payment-method.model';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodComponent } from './payment-method.component';
import { PaymentMethodDetailComponent } from './payment-method-detail.component';
import { PaymentMethodUpdateComponent } from './payment-method-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentMethodResolve implements Resolve<IPaymentMethod> {
  constructor(private service: PaymentMethodService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentMethod> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentMethod: HttpResponse<PaymentMethod>) => {
          if (paymentMethod.body) {
            return of(paymentMethod.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPaymentMethod>) => res.body),
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
    const newItem = new PaymentMethod();
    const paymentMethodTypeId = route.queryParams['paymentMethodTypeId'] ? route.queryParams['paymentMethodTypeId'] : null;
    if (paymentMethodTypeId) {
      newItem.paymentMethodTypeId = paymentMethodTypeId;
    }
    const glAccountId = route.queryParams['glAccountId'] ? route.queryParams['glAccountId'] : null;
    if (glAccountId) {
      newItem.glAccountId = glAccountId;
    }
    const finAccountId = route.queryParams['finAccountId'] ? route.queryParams['finAccountId'] : null;
    if (finAccountId) {
      newItem.finAccountId = finAccountId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    const providerId = route.queryParams['providerId'] ? route.queryParams['providerId'] : null;
    if (providerId) {
      newItem.providerId = providerId;
    }
    return of(newItem);
  }
}

export const paymentMethodRoute: Routes = [
  {
    path: '',
    component: PaymentMethodComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.paymentMethod.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentMethodDetailComponent,
    resolve: {
      paymentMethod: PaymentMethodResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentMethod.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentMethodUpdateComponent,
    resolve: {
      content: PaymentMethodResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentMethod.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentMethodUpdateComponent,
    resolve: {
      content: PaymentMethodResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentMethod.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
