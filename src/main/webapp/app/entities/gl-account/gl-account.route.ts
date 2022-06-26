import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGLAccount, GLAccount } from './gl-account.model';
import { GLAccountService } from './gl-account.service';
import { GLAccountComponent } from './gl-account.component';
import { GLAccountDetailComponent } from './gl-account-detail.component';
import { GLAccountUpdateComponent } from './gl-account-update.component';

@Injectable({ providedIn: 'root' })
export class GLAccountResolve implements Resolve<IGLAccount> {
  constructor(private service: GLAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGLAccount> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gLAccount: HttpResponse<GLAccount>) => {
          if (gLAccount.body) {
            return of(gLAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGLAccount>) => res.body),
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
    const newItem = new GLAccount();
    const accountTypeId = route.queryParams['accountTypeId'] ? route.queryParams['accountTypeId'] : null;
    if (accountTypeId) {
      newItem.accountTypeId = accountTypeId;
    }
    const accountClassId = route.queryParams['accountClassId'] ? route.queryParams['accountClassId'] : null;
    if (accountClassId) {
      newItem.accountClassId = accountClassId;
    }
    const resourceTypeId = route.queryParams['resourceTypeId'] ? route.queryParams['resourceTypeId'] : null;
    if (resourceTypeId) {
      newItem.resourceTypeId = resourceTypeId;
    }
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const gLAccountRoute: Routes = [
  {
    path: '',
    component: GLAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.gLAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GLAccountDetailComponent,
    resolve: {
      gLAccount: GLAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GLAccountUpdateComponent,
    resolve: {
      content: GLAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GLAccountUpdateComponent,
    resolve: {
      content: GLAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.gLAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
