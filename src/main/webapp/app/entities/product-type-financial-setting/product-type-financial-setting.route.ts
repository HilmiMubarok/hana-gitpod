import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IProductTypeFinancialSetting, ProductTypeFinancialSetting } from './product-type-financial-setting.model';
import { ProductTypeFinancialSettingService } from './product-type-financial-setting.service';
import { ProductTypeFinancialSettingComponent } from './product-type-financial-setting.component';
import { ProductTypeFinancialSettingDetailComponent } from './product-type-financial-setting-detail.component';
import { ProductTypeFinancialSettingUpdateComponent } from './product-type-financial-setting-update.component';

@Injectable({ providedIn: 'root' })
export class ProductTypeFinancialSettingResolve implements Resolve<IProductTypeFinancialSetting> {
  constructor(private service: ProductTypeFinancialSettingService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductTypeFinancialSetting> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productTypeFinancialSetting: HttpResponse<ProductTypeFinancialSetting>) => {
          if (productTypeFinancialSetting.body) {
            return of(productTypeFinancialSetting.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IProductTypeFinancialSetting>) => res.body),
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
    const newItem = new ProductTypeFinancialSetting();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const productTypeFinancialSettingRoute: Routes = [
  {
    path: '',
    component: ProductTypeFinancialSettingComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.productTypeFinancialSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductTypeFinancialSettingDetailComponent,
    resolve: {
      productTypeFinancialSetting: ProductTypeFinancialSettingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productTypeFinancialSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductTypeFinancialSettingUpdateComponent,
    resolve: {
      content: ProductTypeFinancialSettingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productTypeFinancialSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductTypeFinancialSettingUpdateComponent,
    resolve: {
      content: ProductTypeFinancialSettingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productTypeFinancialSetting.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
