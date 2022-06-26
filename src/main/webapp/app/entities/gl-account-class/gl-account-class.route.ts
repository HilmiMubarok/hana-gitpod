import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGLAccountClass, GLAccountClass } from './gl-account-class.model';
import { GLAccountClassService } from './gl-account-class.service';
import { GLAccountClassComponent } from './gl-account-class.component';
import { GLAccountClassDetailComponent } from './gl-account-class-detail.component';
import { GLAccountClassUpdateComponent } from './gl-account-class-update.component';

@Injectable({ providedIn: 'root' })
export class GLAccountClassResolve implements Resolve<IGLAccountClass> {
  constructor(private service: GLAccountClassService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGLAccountClass> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gLAccountClass: HttpResponse<GLAccountClass>) => {
          if (gLAccountClass.body) {
            return of(gLAccountClass.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGLAccountClass>) => res.body),
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
    const newItem = new GLAccountClass();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const gLAccountClassRoute: Routes = [
  {
    path: '',
    component: GLAccountClassComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.gLAccountClass.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GLAccountClassDetailComponent,
    resolve: {
      gLAccountClass: GLAccountClassResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccountClass.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GLAccountClassUpdateComponent,
    resolve: {
      content: GLAccountClassResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccountClass.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GLAccountClassUpdateComponent,
    resolve: {
      content: GLAccountClassResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccountClass.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
