import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBaseAccount, BaseAccount } from './base-account.model';
import { BaseAccountService } from './base-account.service';
import { BaseAccountComponent } from './base-account.component';
import { BaseAccountDetailComponent } from './base-account-detail.component';
import { BaseAccountUpdateComponent } from './base-account-update.component';

@Injectable({ providedIn: 'root' })
export class BaseAccountResolve implements Resolve<IBaseAccount> {
  constructor(private service: BaseAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBaseAccount> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((baseAccount: HttpResponse<BaseAccount>) => {
          if (baseAccount.body) {
            return of(baseAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBaseAccount>) => res.body),
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
    const newItem = new BaseAccount();
    const accountTypeId = route.queryParams['accountTypeId'] ? route.queryParams['accountTypeId'] : null;
    if (accountTypeId) {
      newItem.accountTypeId = accountTypeId;
    }
    const ownerId = route.queryParams['ownerId'] ? route.queryParams['ownerId'] : null;
    if (ownerId) {
      newItem.ownerId = ownerId;
    }
    return of(newItem);
  }
}

export const baseAccountRoute: Routes = [
  {
    path: '',
    component: BaseAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.baseAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BaseAccountDetailComponent,
    resolve: {
      baseAccount: BaseAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.baseAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BaseAccountUpdateComponent,
    resolve: {
      content: BaseAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.baseAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BaseAccountUpdateComponent,
    resolve: {
      content: BaseAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.baseAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
