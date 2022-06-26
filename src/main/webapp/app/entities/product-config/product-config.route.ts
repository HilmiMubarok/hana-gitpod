import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IProductConfig, ProductConfig } from './product-config.model';
import { ProductConfigService } from './product-config.service';
import { ProductConfigComponent } from './product-config.component';
import { ProductConfigDetailComponent } from './product-config-detail.component';
import { ProductConfigUpdateComponent } from './product-config-update.component';

@Injectable({ providedIn: 'root' })
export class ProductConfigResolve implements Resolve<IProductConfig> {
  constructor(private service: ProductConfigService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductConfig> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productConfig: HttpResponse<ProductConfig>) => {
          if (productConfig.body) {
            return of(productConfig.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IProductConfig>) => res.body),
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
    const newItem = new ProductConfig();
    const uomId = route.queryParams['uomId'] ? route.queryParams['uomId'] : null;
    if (uomId) {
      newItem.uomId = uomId;
    }
    const purchaseTaxId = route.queryParams['purchaseTaxId'] ? route.queryParams['purchaseTaxId'] : null;
    if (purchaseTaxId) {
      newItem.purchaseTaxId = purchaseTaxId;
    }
    const salesTaxId = route.queryParams['salesTaxId'] ? route.queryParams['salesTaxId'] : null;
    if (salesTaxId) {
      newItem.salesTaxId = salesTaxId;
    }
    return of(newItem);
  }
}

export const productConfigRoute: Routes = [
  {
    path: '',
    component: ProductConfigComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.productConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductConfigDetailComponent,
    resolve: {
      productConfig: ProductConfigResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductConfigUpdateComponent,
    resolve: {
      content: ProductConfigResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductConfigUpdateComponent,
    resolve: {
      content: ProductConfigResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
