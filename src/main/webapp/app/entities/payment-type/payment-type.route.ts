import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPaymentType, PaymentType } from './payment-type.model';
import { PaymentTypeService } from './payment-type.service';
import { PaymentTypeComponent } from './payment-type.component';
import { PaymentTypeDetailComponent } from './payment-type-detail.component';
import { PaymentTypeUpdateComponent } from './payment-type-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentTypeResolve implements Resolve<IPaymentType> {
  constructor(private service: PaymentTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentType: HttpResponse<PaymentType>) => {
          if (paymentType.body) {
            return of(paymentType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPaymentType>) => res.body),
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
    const newItem = new PaymentType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const glAccountTypeId = route.queryParams['glAccountTypeId'] ? route.queryParams['glAccountTypeId'] : null;
    if (glAccountTypeId) {
      newItem.glAccountTypeId = glAccountTypeId;
    }
    const accountTransTypeId = route.queryParams['accountTransTypeId'] ? route.queryParams['accountTransTypeId'] : null;
    if (accountTransTypeId) {
      newItem.accountTransTypeId = accountTransTypeId;
    }
    return of(newItem);
  }
}

export const paymentTypeRoute: Routes = [
  {
    path: '',
    component: PaymentTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.paymentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentTypeDetailComponent,
    resolve: {
      paymentType: PaymentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentTypeUpdateComponent,
    resolve: {
      content: PaymentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentTypeUpdateComponent,
    resolve: {
      content: PaymentTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
