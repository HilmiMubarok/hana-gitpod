import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAccountBalanced, AccountBalanced } from './account-balanced.model';
import { AccountBalancedService } from './account-balanced.service';
import { AccountBalancedComponent } from './account-balanced.component';
import { AccountBalancedDetailComponent } from './account-balanced-detail.component';
import { AccountBalancedUpdateComponent } from './account-balanced-update.component';

@Injectable({ providedIn: 'root' })
export class AccountBalancedResolve implements Resolve<IAccountBalanced> {
  constructor(private service: AccountBalancedService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountBalanced> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountBalanced: HttpResponse<AccountBalanced>) => {
          if (accountBalanced.body) {
            return of(accountBalanced.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAccountBalanced>) => res.body),
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
    const newItem = new AccountBalanced();
    const accountId = route.queryParams['accountId'] ? route.queryParams['accountId'] : null;
    if (accountId) {
      newItem.accountId = accountId;
    }
    const transCategoryId = route.queryParams['transCategoryId'] ? route.queryParams['transCategoryId'] : null;
    if (transCategoryId) {
      newItem.transCategoryId = transCategoryId;
    }
    return of(newItem);
  }
}

export const accountBalancedRoute: Routes = [
  {
    path: '',
    component: AccountBalancedComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.accountBalanced.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountBalancedDetailComponent,
    resolve: {
      accountBalanced: AccountBalancedResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountBalanced.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountBalancedUpdateComponent,
    resolve: {
      content: AccountBalancedResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountBalanced.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountBalancedUpdateComponent,
    resolve: {
      content: AccountBalancedResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountBalanced.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
