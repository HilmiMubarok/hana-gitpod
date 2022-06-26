import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGLResourceType, GLResourceType } from './gl-resource-type.model';
import { GLResourceTypeService } from './gl-resource-type.service';
import { GLResourceTypeComponent } from './gl-resource-type.component';
import { GLResourceTypeDetailComponent } from './gl-resource-type-detail.component';
import { GLResourceTypeUpdateComponent } from './gl-resource-type-update.component';

@Injectable({ providedIn: 'root' })
export class GLResourceTypeResolve implements Resolve<IGLResourceType> {
  constructor(private service: GLResourceTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGLResourceType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gLResourceType: HttpResponse<GLResourceType>) => {
          if (gLResourceType.body) {
            return of(gLResourceType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGLResourceType>) => res.body),
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
    const newItem = new GLResourceType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const gLResourceTypeRoute: Routes = [
  {
    path: '',
    component: GLResourceTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.gLResourceType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GLResourceTypeDetailComponent,
    resolve: {
      gLResourceType: GLResourceTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLResourceType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GLResourceTypeUpdateComponent,
    resolve: {
      content: GLResourceTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLResourceType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GLResourceTypeUpdateComponent,
    resolve: {
      content: GLResourceTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLResourceType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
