import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFinancialProduct, FinancialProduct } from './financial-product.model';
import { FinancialProductService } from './financial-product.service';
import { FinancialProductComponent } from './financial-product.component';
import { FinancialProductDetailComponent } from './financial-product-detail.component';
import { FinancialProductUpdateComponent } from './financial-product-update.component';

@Injectable({ providedIn: 'root' })
export class FinancialProductResolve implements Resolve<IFinancialProduct> {
  constructor(private service: FinancialProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinancialProduct> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((financialProduct: HttpResponse<FinancialProduct>) => {
          if (financialProduct.body) {
            return of(financialProduct.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFinancialProduct>) => res.body),
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
    const newItem = new FinancialProduct();
    const productTypeId = route.queryParams['productTypeId'] ? route.queryParams['productTypeId'] : null;
    if (productTypeId) {
      newItem.productTypeId = productTypeId;
    }
    return of(newItem);
  }
}

export const financialProductRoute: Routes = [
  {
    path: '',
    component: FinancialProductComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.financialProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinancialProductDetailComponent,
    resolve: {
      financialProduct: FinancialProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.financialProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinancialProductUpdateComponent,
    resolve: {
      content: FinancialProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.financialProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinancialProductUpdateComponent,
    resolve: {
      content: FinancialProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.financialProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
