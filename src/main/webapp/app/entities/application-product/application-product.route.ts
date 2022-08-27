import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IApplicationProduct, ApplicationProduct } from './application-product.model';
import { ApplicationProductService } from './application-product.service';
import { ApplicationProductComponent } from './application-product.component';
import { ApplicationProductDetailComponent } from './application-product-detail.component';
import { ApplicationProductUpdateComponent } from './application-product-update.component';

@Injectable({ providedIn: 'root' })
export class ApplicationProductResolve implements Resolve<IApplicationProduct> {
  constructor(private service: ApplicationProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationProduct> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((applicationProduct: HttpResponse<ApplicationProduct>) => {
          if (applicationProduct.body) {
            return of(applicationProduct.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IApplicationProduct>) => res.body),
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
    const newItem = new ApplicationProduct();
    const applicationId = route.queryParams['applicationId'] ? route.queryParams['applicationId'] : null;
    if (applicationId) {
      newItem.applicationId = applicationId;
    }
    const productId = route.queryParams['productId'] ? route.queryParams['productId'] : null;
    if (productId) {
      newItem.productId = productId;
    }
    return of(newItem);
  }
}

export const applicationProductRoute: Routes = [
  {
    path: '',
    component: ApplicationProductComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.applicationProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationProductDetailComponent,
    resolve: {
      applicationProduct: ApplicationProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.applicationProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationProductUpdateComponent,
    resolve: {
      content: ApplicationProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.applicationProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationProductUpdateComponent,
    resolve: {
      content: ApplicationProductResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.applicationProduct.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
