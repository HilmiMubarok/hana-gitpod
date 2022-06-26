import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IRoleVendor, RoleVendor } from './role-vendor.model';
import { RoleVendorService } from './role-vendor.service';
import { RoleVendorComponent } from './role-vendor.component';
import { RoleVendorDetailComponent } from './role-vendor-detail.component';
import { RoleVendorUpdateComponent } from './role-vendor-update.component';

@Injectable({ providedIn: 'root' })
export class RoleVendorResolve implements Resolve<IRoleVendor> {
  constructor(private service: RoleVendorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoleVendor> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roleVendor: HttpResponse<RoleVendor>) => {
          if (roleVendor.body) {
            return of(roleVendor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IRoleVendor>) => res.body),
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
    const newItem = new RoleVendor();
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const roleVendorRoute: Routes = [
  {
    path: '',
    component: RoleVendorComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.roleVendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoleVendorDetailComponent,
    resolve: {
      roleVendor: RoleVendorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleVendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoleVendorUpdateComponent,
    resolve: {
      content: RoleVendorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleVendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoleVendorUpdateComponent,
    resolve: {
      content: RoleVendorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleVendor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
