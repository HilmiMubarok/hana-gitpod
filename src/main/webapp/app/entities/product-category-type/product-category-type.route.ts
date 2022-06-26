import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IProductCategoryType, ProductCategoryType } from './product-category-type.model';
import { ProductCategoryTypeService } from './product-category-type.service';
import { ProductCategoryTypeComponent } from './product-category-type.component';
import { ProductCategoryTypeDetailComponent } from './product-category-type-detail.component';
import { ProductCategoryTypeUpdateComponent } from './product-category-type-update.component';

@Injectable({ providedIn: 'root' })
export class ProductCategoryTypeResolve implements Resolve<IProductCategoryType> {
  constructor(private service: ProductCategoryTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductCategoryType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productCategoryType: HttpResponse<ProductCategoryType>) => {
          if (productCategoryType.body) {
            return of(productCategoryType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IProductCategoryType>) => res.body),
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
    const newItem = new ProductCategoryType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const productCategoryTypeRoute: Routes = [
  {
    path: '',
    component: ProductCategoryTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.productCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductCategoryTypeDetailComponent,
    resolve: {
      productCategoryType: ProductCategoryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductCategoryTypeUpdateComponent,
    resolve: {
      content: ProductCategoryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductCategoryTypeUpdateComponent,
    resolve: {
      content: ProductCategoryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productCategoryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
