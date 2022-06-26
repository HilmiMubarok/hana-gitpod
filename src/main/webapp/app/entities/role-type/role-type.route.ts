import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IRoleType, RoleType } from './role-type.model';
import { RoleTypeService } from './role-type.service';
import { RoleTypeComponent } from './role-type.component';
import { RoleTypeDetailComponent } from './role-type-detail.component';
import { RoleTypeUpdateComponent } from './role-type-update.component';

@Injectable({ providedIn: 'root' })
export class RoleTypeResolve implements Resolve<IRoleType> {
  constructor(private service: RoleTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRoleType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((roleType: HttpResponse<RoleType>) => {
          if (roleType.body) {
            return of(roleType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IRoleType>) => res.body),
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
    const newItem = new RoleType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const roleTypeRoute: Routes = [
  {
    path: '',
    component: RoleTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.roleType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoleTypeDetailComponent,
    resolve: {
      roleType: RoleTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoleTypeUpdateComponent,
    resolve: {
      content: RoleTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoleTypeUpdateComponent,
    resolve: {
      content: RoleTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.roleType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
