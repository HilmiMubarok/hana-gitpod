import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBillingItem, BillingItem } from './billing-item.model';
import { BillingItemService } from './billing-item.service';
import { BillingItemComponent } from './billing-item.component';
import { BillingItemDetailComponent } from './billing-item-detail.component';
import { BillingItemUpdateComponent } from './billing-item-update.component';

@Injectable({ providedIn: 'root' })
export class BillingItemResolve implements Resolve<IBillingItem> {
  constructor(private service: BillingItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillingItem> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billingItem: HttpResponse<BillingItem>) => {
          if (billingItem.body) {
            return of(billingItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBillingItem>) => res.body),
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
    const newItem = new BillingItem();
    const billingId = route.queryParams['billingId'] ? route.queryParams['billingId'] : null;
    if (billingId) {
      newItem.billingId = billingId;
    }
    const itemTypeId = route.queryParams['itemTypeId'] ? route.queryParams['itemTypeId'] : null;
    if (itemTypeId) {
      newItem.itemTypeId = itemTypeId;
    }
    const productId = route.queryParams['productId'] ? route.queryParams['productId'] : null;
    if (productId) {
      newItem.productId = productId;
    }
    const featureId = route.queryParams['featureId'] ? route.queryParams['featureId'] : null;
    if (featureId) {
      newItem.featureId = featureId;
    }
    return of(newItem);
  }
}

export const billingItemRoute: Routes = [
  {
    path: '',
    component: BillingItemComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.billingItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingItemDetailComponent,
    resolve: {
      billingItem: BillingItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingItemUpdateComponent,
    resolve: {
      content: BillingItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingItemUpdateComponent,
    resolve: {
      content: BillingItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
