import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPaymentApplication, PaymentApplication } from './payment-application.model';
import { PaymentApplicationService } from './payment-application.service';
import { PaymentApplicationComponent } from './payment-application.component';
import { PaymentApplicationDetailComponent } from './payment-application-detail.component';
import { PaymentApplicationUpdateComponent } from './payment-application-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentApplicationResolve implements Resolve<IPaymentApplication> {
  constructor(private service: PaymentApplicationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentApplication> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentApplication: HttpResponse<PaymentApplication>) => {
          if (paymentApplication.body) {
            return of(paymentApplication.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPaymentApplication>) => res.body),
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
    const newItem = new PaymentApplication();
    const paymentId = route.queryParams['paymentId'] ? route.queryParams['paymentId'] : null;
    if (paymentId) {
      newItem.paymentId = paymentId;
    }
    const billingId = route.queryParams['billingId'] ? route.queryParams['billingId'] : null;
    if (billingId) {
      newItem.billingId = billingId;
    }
    const billingItemId = route.queryParams['billingItemId'] ? route.queryParams['billingItemId'] : null;
    if (billingItemId) {
      newItem.billingItemId = billingItemId;
    }
    return of(newItem);
  }
}

export const paymentApplicationRoute: Routes = [
  {
    path: '',
    component: PaymentApplicationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.paymentApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentApplicationDetailComponent,
    resolve: {
      paymentApplication: PaymentApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentApplicationUpdateComponent,
    resolve: {
      content: PaymentApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentApplicationUpdateComponent,
    resolve: {
      content: PaymentApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
