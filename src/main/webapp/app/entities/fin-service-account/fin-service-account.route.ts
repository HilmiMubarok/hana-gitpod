import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFinServiceAccount, FinServiceAccount } from './fin-service-account.model';
import { FinServiceAccountService } from './fin-service-account.service';
import { FinServiceAccountComponent } from './fin-service-account.component';
import { FinServiceAccountDetailComponent } from './fin-service-account-detail.component';
import { FinServiceAccountUpdateComponent } from './fin-service-account-update.component';

@Injectable({ providedIn: 'root' })
export class FinServiceAccountResolve implements Resolve<IFinServiceAccount> {
  constructor(private service: FinServiceAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinServiceAccount> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finServiceAccount: HttpResponse<FinServiceAccount>) => {
          if (finServiceAccount.body) {
            return of(finServiceAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFinServiceAccount>) => res.body),
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
    const newItem = new FinServiceAccount();
    const accountTypeId = route.queryParams['accountTypeId'] ? route.queryParams['accountTypeId'] : null;
    if (accountTypeId) {
      newItem.accountTypeId = accountTypeId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    const ownerId = route.queryParams['ownerId'] ? route.queryParams['ownerId'] : null;
    if (ownerId) {
      newItem.ownerId = ownerId;
    }
    const statusId = route.queryParams['statusId'] ? route.queryParams['statusId'] : null;
    if (statusId) {
      newItem.statusId = statusId;
    }
    return of(newItem);
  }
}

export const finServiceAccountRoute: Routes = [
  {
    path: '',
    component: FinServiceAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.finServiceAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinServiceAccountDetailComponent,
    resolve: {
      finServiceAccount: FinServiceAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finServiceAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinServiceAccountUpdateComponent,
    resolve: {
      content: FinServiceAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finServiceAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinServiceAccountUpdateComponent,
    resolve: {
      content: FinServiceAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finServiceAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
