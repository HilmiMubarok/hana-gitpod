import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IVendorProduct, VendorProduct } from './vendor-product.model';
import { VendorProductService } from './vendor-product.service';

@Injectable({ providedIn: 'root' })
export class VendorProductResolve implements Resolve<IVendorProduct> {
  constructor(private service: VendorProductService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVendorProduct> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vendorProduct: HttpResponse<VendorProduct>) => {
          if (vendorProduct.body) {
            return of(vendorProduct.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IVendorProduct>) => res.body),
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
    const newItem = new VendorProduct();
    const productId = route.queryParams['productId'] ? route.queryParams['productId'] : null;
    if (productId) {
      newItem.productId = productId;
    }
    const organizationId = route.queryParams['organizationId'] ? route.queryParams['organizationId'] : null;
    if (organizationId) {
      newItem.organizationId = organizationId;
    }
    const vendorId = route.queryParams['vendorId'] ? route.queryParams['vendorId'] : null;
    if (vendorId) {
      newItem.vendorId = vendorId;
    }
    return of(newItem);
  }
}

export const vendorProductRoute: Routes = [];
