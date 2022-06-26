import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IProductClassification, ProductClassification } from './product-classification.model';
import { ProductClassificationService } from './product-classification.service';
import { ProductClassificationComponent } from './product-classification.component';
import { ProductClassificationDetailComponent } from './product-classification-detail.component';
import { ProductClassificationUpdateComponent } from './product-classification-update.component';

@Injectable({ providedIn: 'root' })
export class ProductClassificationResolve implements Resolve<IProductClassification> {
  constructor(private service: ProductClassificationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductClassification> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productClassification: HttpResponse<ProductClassification>) => {
          if (productClassification.body) {
            return of(productClassification.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IProductClassification>) => res.body),
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
    const newItem = new ProductClassification();
    const categoryId = route.queryParams['categoryId'] ? route.queryParams['categoryId'] : null;
    if (categoryId) {
      newItem.categoryId = categoryId;
    }
    const productId = route.queryParams['productId'] ? route.queryParams['productId'] : null;
    if (productId) {
      newItem.productId = productId;
    }
    return of(newItem);
  }
}

export const productClassificationRoute: Routes = [
  {
    path: '',
    component: ProductClassificationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.productClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductClassificationDetailComponent,
    resolve: {
      productClassification: ProductClassificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductClassificationUpdateComponent,
    resolve: {
      content: ProductClassificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductClassificationUpdateComponent,
    resolve: {
      content: ProductClassificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.productClassification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
