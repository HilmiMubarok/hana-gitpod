import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAccountTransCategory, AccountTransCategory } from './account-trans-category.model';
import { AccountTransCategoryService } from './account-trans-category.service';
import { AccountTransCategoryComponent } from './account-trans-category.component';
import { AccountTransCategoryDetailComponent } from './account-trans-category-detail.component';
import { AccountTransCategoryUpdateComponent } from './account-trans-category-update.component';

@Injectable({ providedIn: 'root' })
export class AccountTransCategoryResolve implements Resolve<IAccountTransCategory> {
  constructor(private service: AccountTransCategoryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountTransCategory> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountTransCategory: HttpResponse<AccountTransCategory>) => {
          if (accountTransCategory.body) {
            return of(accountTransCategory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAccountTransCategory>) => res.body),
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
    const newItem = new AccountTransCategory();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const accountTransCategoryRoute: Routes = [
  {
    path: '',
    component: AccountTransCategoryComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.accountTransCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountTransCategoryDetailComponent,
    resolve: {
      accountTransCategory: AccountTransCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTransCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountTransCategoryUpdateComponent,
    resolve: {
      content: AccountTransCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTransCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountTransCategoryUpdateComponent,
    resolve: {
      content: AccountTransCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTransCategory.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
