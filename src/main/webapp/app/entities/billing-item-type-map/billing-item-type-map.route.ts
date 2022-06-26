import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBillingItemTypeMap, BillingItemTypeMap } from './billing-item-type-map.model';
import { BillingItemTypeMapService } from './billing-item-type-map.service';
import { BillingItemTypeMapComponent } from './billing-item-type-map.component';
import { BillingItemTypeMapDetailComponent } from './billing-item-type-map-detail.component';
import { BillingItemTypeMapUpdateComponent } from './billing-item-type-map-update.component';

@Injectable({ providedIn: 'root' })
export class BillingItemTypeMapResolve implements Resolve<IBillingItemTypeMap> {
  constructor(private service: BillingItemTypeMapService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBillingItemTypeMap> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((billingItemTypeMap: HttpResponse<BillingItemTypeMap>) => {
          if (billingItemTypeMap.body) {
            return of(billingItemTypeMap.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBillingItemTypeMap>) => res.body),
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
    const newItem = new BillingItemTypeMap();
    const billingTypeId = route.queryParams['billingTypeId'] ? route.queryParams['billingTypeId'] : null;
    if (billingTypeId) {
      newItem.billingTypeId = billingTypeId;
    }
    const itemTypeId = route.queryParams['itemTypeId'] ? route.queryParams['itemTypeId'] : null;
    if (itemTypeId) {
      newItem.itemTypeId = itemTypeId;
    }
    return of(newItem);
  }
}

export const billingItemTypeMapRoute: Routes = [
  {
    path: '',
    component: BillingItemTypeMapComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.billingItemTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingItemTypeMapDetailComponent,
    resolve: {
      billingItemTypeMap: BillingItemTypeMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItemTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingItemTypeMapUpdateComponent,
    resolve: {
      content: BillingItemTypeMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItemTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingItemTypeMapUpdateComponent,
    resolve: {
      content: BillingItemTypeMapResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.billingItemTypeMap.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
