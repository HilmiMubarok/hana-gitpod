import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IProductTypeConfig, ProductTypeConfig } from './product-type-config.model';
import { ProductTypeConfigService } from './product-type-config.service';
import { ProductTypeConfigComponent } from './product-type-config.component';
import { ProductTypeConfigDetailComponent } from './product-type-config-detail.component';
import { ProductTypeConfigUpdateComponent } from './product-type-config-update.component';

@Injectable({ providedIn: 'root' })
export class ProductTypeConfigResolve implements Resolve<IProductTypeConfig> {
  constructor(private service: ProductTypeConfigService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductTypeConfig> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productTypeConfig: HttpResponse<ProductTypeConfig>) => {
          if (productTypeConfig.body) {
            return of(productTypeConfig.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IProductTypeConfig>) => res.body),
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
    const newItem = new ProductTypeConfig();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const productTypeConfigRoute: Routes = [
  {
    path: '',
    component: ProductTypeConfigComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.productTypeConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductTypeConfigDetailComponent,
    resolve: {
      productTypeConfig: ProductTypeConfigResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productTypeConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductTypeConfigUpdateComponent,
    resolve: {
      content: ProductTypeConfigResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productTypeConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductTypeConfigUpdateComponent,
    resolve: {
      content: ProductTypeConfigResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productTypeConfig.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
