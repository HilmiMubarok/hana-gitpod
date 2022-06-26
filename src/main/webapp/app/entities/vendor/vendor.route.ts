import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IVendor, Vendor } from './vendor.model';
import { VendorService } from './vendor.service';
import { VendorComponent } from './vendor.component';
import { VendorDetailComponent } from './vendor-detail.component';
import { VendorUpdateComponent } from './vendor-update.component';

@Injectable({ providedIn: 'root' })
export class VendorResolve implements Resolve<IVendor> {
  constructor(private service: VendorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVendor> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vendor: HttpResponse<Vendor>) => {
          if (vendor.body) {
            return of(vendor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IVendor>) => res.body),
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
    const newItem = new Vendor();
    const partyTypeId = route.queryParams['partyTypeId'] ? route.queryParams['partyTypeId'] : null;
    if (partyTypeId) {
      newItem.partyTypeId = partyTypeId;
    }
    const postalAddressId = route.queryParams['postalAddressId'] ? route.queryParams['postalAddressId'] : null;
    if (postalAddressId) {
      newItem.postalAddressId = postalAddressId;
    }
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    return of(newItem);
  }
}

export const vendorRoute: Routes = [
  {
    path: '',
    component: VendorComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.vendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VendorDetailComponent,
    resolve: {
      vendor: VendorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.vendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VendorUpdateComponent,
    resolve: {
      content: VendorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.vendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VendorUpdateComponent,
    resolve: {
      content: VendorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.vendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
