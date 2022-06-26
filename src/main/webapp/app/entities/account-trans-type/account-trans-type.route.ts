import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAccountTransType, AccountTransType } from './account-trans-type.model';
import { AccountTransTypeService } from './account-trans-type.service';
import { AccountTransTypeComponent } from './account-trans-type.component';
import { AccountTransTypeDetailComponent } from './account-trans-type-detail.component';
import { AccountTransTypeUpdateComponent } from './account-trans-type-update.component';

@Injectable({ providedIn: 'root' })
export class AccountTransTypeResolve implements Resolve<IAccountTransType> {
  constructor(private service: AccountTransTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountTransType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountTransType: HttpResponse<AccountTransType>) => {
          if (accountTransType.body) {
            return of(accountTransType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAccountTransType>) => res.body),
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
    const newItem = new AccountTransType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const transCategoryId = route.queryParams['transCategoryId'] ? route.queryParams['transCategoryId'] : null;
    if (transCategoryId) {
      newItem.transCategoryId = transCategoryId;
    }
    return of(newItem);
  }
}

export const accountTransTypeRoute: Routes = [
  {
    path: '',
    component: AccountTransTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.accountTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountTransTypeDetailComponent,
    resolve: {
      accountTransType: AccountTransTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountTransTypeUpdateComponent,
    resolve: {
      content: AccountTransTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountTransTypeUpdateComponent,
    resolve: {
      content: AccountTransTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
