import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBillingItemType, BillingItemType } from './billing-item-type.model';
import { BillingItemTypeService } from './billing-item-type.service';
import { BillingItemTypeComponent } from './billing-item-type.component';
import { BillingItemTypeDetailComponent } from './billing-item-type-detail.component';
import { BillingItemTypeUpdateComponent } from './billing-item-type-update.component';

@Injectable({ providedIn: 'root' })
export class BillingItemTypeResolve implements Resolve<IBillingItemType> {
  constructor(private service: BillingItemTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillingItemType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billingItemType: HttpResponse<BillingItemType>) => {
          if (billingItemType.body) {
            return of(billingItemType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBillingItemType>) => res.body),
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
    const newItem = new BillingItemType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const glAccountId = route.queryParams['glAccountId'] ? route.queryParams['glAccountId'] : null;
    if (glAccountId) {
      newItem.glAccountId = glAccountId;
    }
    return of(newItem);
  }
}

export const billingItemTypeRoute: Routes = [
  {
    path: '',
    component: BillingItemTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.billingItemType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingItemTypeDetailComponent,
    resolve: {
      billingItemType: BillingItemTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItemType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingItemTypeUpdateComponent,
    resolve: {
      content: BillingItemTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItemType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingItemTypeUpdateComponent,
    resolve: {
      content: BillingItemTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItemType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
