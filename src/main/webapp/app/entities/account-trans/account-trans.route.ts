import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAccountTrans, AccountTrans } from './account-trans.model';
import { AccountTransService } from './account-trans.service';
import { AccountTransComponent } from './account-trans.component';
import { AccountTransDetailComponent } from './account-trans-detail.component';
import { AccountTransUpdateComponent } from './account-trans-update.component';

@Injectable({ providedIn: 'root' })
export class AccountTransResolve implements Resolve<IAccountTrans> {
  constructor(private service: AccountTransService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountTrans> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountTrans: HttpResponse<AccountTrans>) => {
          if (accountTrans.body) {
            return of(accountTrans.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAccountTrans>) => res.body),
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
    const newItem = new AccountTrans();
    const accountId = route.queryParams['accountId'] ? route.queryParams['accountId'] : null;
    if (accountId) {
      newItem.accountId = accountId;
    }
    const transactionTypeId = route.queryParams['transactionTypeId'] ? route.queryParams['transactionTypeId'] : null;
    if (transactionTypeId) {
      newItem.transactionTypeId = transactionTypeId;
    }
    return of(newItem);
  }
}

export const accountTransRoute: Routes = [
  {
    path: '',
    component: AccountTransComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.accountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountTransDetailComponent,
    resolve: {
      accountTrans: AccountTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountTransUpdateComponent,
    resolve: {
      content: AccountTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountTransUpdateComponent,
    resolve: {
      content: AccountTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
