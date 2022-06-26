import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPaymentGLAccountTypeMap, PaymentGLAccountTypeMap } from './payment-gl-account-type-map.model';
import { PaymentGLAccountTypeMapService } from './payment-gl-account-type-map.service';
import { PaymentGLAccountTypeMapComponent } from './payment-gl-account-type-map.component';
import { PaymentGLAccountTypeMapDetailComponent } from './payment-gl-account-type-map-detail.component';
import { PaymentGLAccountTypeMapUpdateComponent } from './payment-gl-account-type-map-update.component';

@Injectable({ providedIn: 'root' })
export class PaymentGLAccountTypeMapResolve implements Resolve<IPaymentGLAccountTypeMap> {
  constructor(private service: PaymentGLAccountTypeMapService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaymentGLAccountTypeMap> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paymentGLAccountTypeMap: HttpResponse<PaymentGLAccountTypeMap>) => {
          if (paymentGLAccountTypeMap.body) {
            return of(paymentGLAccountTypeMap.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPaymentGLAccountTypeMap>) => res.body),
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
    const newItem = new PaymentGLAccountTypeMap();
    const paymentTypeId = route.queryParams['paymentTypeId'] ? route.queryParams['paymentTypeId'] : null;
    if (paymentTypeId) {
      newItem.paymentTypeId = paymentTypeId;
    }
    const glAccountTypeId = route.queryParams['glAccountTypeId'] ? route.queryParams['glAccountTypeId'] : null;
    if (glAccountTypeId) {
      newItem.glAccountTypeId = glAccountTypeId;
    }
    const organizationId = route.queryParams['organizationId'] ? route.queryParams['organizationId'] : null;
    if (organizationId) {
      newItem.organizationId = organizationId;
    }
    return of(newItem);
  }
}

export const paymentGLAccountTypeMapRoute: Routes = [
  {
    path: '',
    component: PaymentGLAccountTypeMapComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.paymentGLAccountTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentGLAccountTypeMapDetailComponent,
    resolve: {
      paymentGLAccountTypeMap: PaymentGLAccountTypeMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentGLAccountTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentGLAccountTypeMapUpdateComponent,
    resolve: {
      content: PaymentGLAccountTypeMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentGLAccountTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentGLAccountTypeMapUpdateComponent,
    resolve: {
      content: PaymentGLAccountTypeMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.paymentGLAccountTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
