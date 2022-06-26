import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFinAccount, FinAccount } from './fin-account.model';
import { FinAccountService } from './fin-account.service';
import { FinAccountComponent } from './fin-account.component';
import { FinAccountDetailComponent } from './fin-account-detail.component';
import { FinAccountUpdateComponent } from './fin-account-update.component';

@Injectable({ providedIn: 'root' })
export class FinAccountResolve implements Resolve<IFinAccount> {
  constructor(private service: FinAccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinAccount> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finAccount: HttpResponse<FinAccount>) => {
          if (finAccount.body) {
            return of(finAccount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFinAccount>) => res.body),
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
    const newItem = new FinAccount();
    const accountTypeId = route.queryParams['accountTypeId'] ? route.queryParams['accountTypeId'] : null;
    if (accountTypeId) {
      newItem.accountTypeId = accountTypeId;
    }
    const ownerId = route.queryParams['ownerId'] ? route.queryParams['ownerId'] : null;
    if (ownerId) {
      newItem.ownerId = ownerId;
    }
    const glAccountId = route.queryParams['glAccountId'] ? route.queryParams['glAccountId'] : null;
    if (glAccountId) {
      newItem.glAccountId = glAccountId;
    }
    return of(newItem);
  }
}

export const finAccountRoute: Routes = [
  {
    path: '',
    component: FinAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.finAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinAccountDetailComponent,
    resolve: {
      finAccount: FinAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinAccountUpdateComponent,
    resolve: {
      content: FinAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinAccountUpdateComponent,
    resolve: {
      content: FinAccountResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finAccount.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
