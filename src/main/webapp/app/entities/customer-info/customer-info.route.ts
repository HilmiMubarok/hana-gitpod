import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICustomerInfo, CustomerInfo } from './customer-info.model';
import { CustomerInfoService } from './customer-info.service';
import { CustomerInfoComponent } from './customer-info.component';
import { CustomerInfoDetailComponent } from './customer-info-detail.component';
import { CustomerInfoUpdateComponent } from './customer-info-update.component';

@Injectable({ providedIn: 'root' })
export class CustomerInfoResolve implements Resolve<ICustomerInfo> {
  constructor(private service: CustomerInfoService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomerInfo> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customerInfo: HttpResponse<CustomerInfo>) => {
          if (customerInfo.body) {
            return of(customerInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICustomerInfo>) => res.body),
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
    const newItem = new CustomerInfo();
    return of(newItem);
  }
}

export const customerInfoRoute: Routes = [
  {
    path: '',
    component: CustomerInfoComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.customerInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerInfoDetailComponent,
    resolve: {
      customerInfo: CustomerInfoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.customerInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerInfoUpdateComponent,
    resolve: {
      content: CustomerInfoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.customerInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerInfoUpdateComponent,
    resolve: {
      content: CustomerInfoResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.customerInfo.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
