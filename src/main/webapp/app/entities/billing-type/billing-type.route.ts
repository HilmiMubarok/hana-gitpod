import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBillingType, BillingType } from './billing-type.model';
import { BillingTypeService } from './billing-type.service';
import { BillingTypeComponent } from './billing-type.component';
import { BillingTypeDetailComponent } from './billing-type-detail.component';
import { BillingTypeUpdateComponent } from './billing-type-update.component';

@Injectable({ providedIn: 'root' })
export class BillingTypeResolve implements Resolve<IBillingType> {
  constructor(private service: BillingTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillingType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billingType: HttpResponse<BillingType>) => {
          if (billingType.body) {
            return of(billingType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBillingType>) => res.body),
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
    const newItem = new BillingType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const paymentTypeId = route.queryParams['paymentTypeId'] ? route.queryParams['paymentTypeId'] : null;
    if (paymentTypeId) {
      newItem.paymentTypeId = paymentTypeId;
    }
    return of(newItem);
  }
}

export const billingTypeRoute: Routes = [
  {
    path: '',
    component: BillingTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.billingType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingTypeDetailComponent,
    resolve: {
      billingType: BillingTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingTypeUpdateComponent,
    resolve: {
      content: BillingTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingTypeUpdateComponent,
    resolve: {
      content: BillingTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
