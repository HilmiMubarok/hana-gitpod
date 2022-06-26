import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGLAccountType, GLAccountType } from './gl-account-type.model';
import { GLAccountTypeService } from './gl-account-type.service';
import { GLAccountTypeComponent } from './gl-account-type.component';
import { GLAccountTypeDetailComponent } from './gl-account-type-detail.component';
import { GLAccountTypeUpdateComponent } from './gl-account-type-update.component';

@Injectable({ providedIn: 'root' })
export class GLAccountTypeResolve implements Resolve<IGLAccountType> {
  constructor(private service: GLAccountTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGLAccountType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gLAccountType: HttpResponse<GLAccountType>) => {
          if (gLAccountType.body) {
            return of(gLAccountType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGLAccountType>) => res.body),
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
    const newItem = new GLAccountType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const gLAccountTypeRoute: Routes = [
  {
    path: '',
    component: GLAccountTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.gLAccountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GLAccountTypeDetailComponent,
    resolve: {
      gLAccountType: GLAccountTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GLAccountTypeUpdateComponent,
    resolve: {
      content: GLAccountTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GLAccountTypeUpdateComponent,
    resolve: {
      content: GLAccountTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
