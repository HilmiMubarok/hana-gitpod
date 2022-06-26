import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IServiceProduct, ServiceProduct } from './service-product.model';
import { ServiceProductService } from './service-product.service';
import { ServiceProductComponent } from './service-product.component';
import { ServiceProductDetailComponent } from './service-product-detail.component';
import { ServiceProductUpdateComponent } from './service-product-update.component';

@Injectable({ providedIn: 'root' })
export class ServiceProductResolve implements Resolve<IServiceProduct> {
  constructor(private service: ServiceProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IServiceProduct> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((serviceProduct: HttpResponse<ServiceProduct>) => {
          if (serviceProduct.body) {
            return of(serviceProduct.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IServiceProduct>) => res.body),
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
    const newItem = new ServiceProduct();
    const productTypeId = route.queryParams['productTypeId'] ? route.queryParams['productTypeId'] : null;
    if (productTypeId) {
      newItem.productTypeId = productTypeId;
    }
    const configId = route.queryParams['configId'] ? route.queryParams['configId'] : null;
    if (configId) {
      newItem.configId = configId;
    }
    return of(newItem);
  }
}

export const serviceProductRoute: Routes = [
  {
    path: '',
    component: ServiceProductComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.serviceProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServiceProductDetailComponent,
    resolve: {
      serviceProduct: ServiceProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.serviceProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServiceProductUpdateComponent,
    resolve: {
      content: ServiceProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.serviceProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServiceProductUpdateComponent,
    resolve: {
      content: ServiceProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.serviceProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
