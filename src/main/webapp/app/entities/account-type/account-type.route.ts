import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAccountType, AccountType } from './account-type.model';
import { AccountTypeService } from './account-type.service';
import { AccountTypeComponent } from './account-type.component';
import { AccountTypeDetailComponent } from './account-type-detail.component';
import { AccountTypeUpdateComponent } from './account-type-update.component';

@Injectable({ providedIn: 'root' })
export class AccountTypeResolve implements Resolve<IAccountType> {
  constructor(private service: AccountTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccountType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accountType: HttpResponse<AccountType>) => {
          if (accountType.body) {
            return of(accountType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAccountType>) => res.body),
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
    const newItem = new AccountType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const accountTypeRoute: Routes = [
  {
    path: '',
    component: AccountTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.accountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountTypeDetailComponent,
    resolve: {
      accountType: AccountTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountTypeUpdateComponent,
    resolve: {
      content: AccountTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountTypeUpdateComponent,
    resolve: {
      content: AccountTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.accountType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
