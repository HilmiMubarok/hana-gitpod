import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBaseAccount, BaseAccount } from './base-account.model';
import { BaseAccountService } from './base-account.service';

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

export const baseAccountRoute: Routes = [];
