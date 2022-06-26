import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IRoleInternal, RoleInternal } from './role-internal.model';
import { RoleInternalService } from './role-internal.service';
import { RoleInternalComponent } from './role-internal.component';
import { RoleInternalDetailComponent } from './role-internal-detail.component';
import { RoleInternalUpdateComponent } from './role-internal-update.component';

@Injectable({ providedIn: 'root' })
export class RoleInternalResolve implements Resolve<IRoleInternal> {
  constructor(private service: RoleInternalService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoleInternal> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roleInternal: HttpResponse<RoleInternal>) => {
          if (roleInternal.body) {
            return of(roleInternal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IRoleInternal>) => res.body),
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
    const newItem = new RoleInternal();
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

export const roleInternalRoute: Routes = [
  {
    path: '',
    component: RoleInternalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.roleInternal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoleInternalDetailComponent,
    resolve: {
      roleInternal: RoleInternalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleInternal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoleInternalUpdateComponent,
    resolve: {
      content: RoleInternalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleInternal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoleInternalUpdateComponent,
    resolve: {
      content: RoleInternalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleInternal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
