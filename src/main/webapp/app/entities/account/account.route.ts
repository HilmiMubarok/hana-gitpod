import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAccount, Account } from './account.model';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class AccountResolve implements Resolve<IAccount> {
  constructor(private service: AccountService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccount> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((account: HttpResponse<Account>) => {
          if (account.body) {
            return of(account.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAccount>) => res.body),
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
    const newItem = new Account();
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
    return of(newItem);
  }
}

export const accountRoute: Routes = [];
