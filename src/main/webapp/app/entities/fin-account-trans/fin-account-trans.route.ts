import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFinAccountTrans, FinAccountTrans } from './fin-account-trans.model';
import { FinAccountTransService } from './fin-account-trans.service';
import { FinAccountTransComponent } from './fin-account-trans.component';
import { FinAccountTransDetailComponent } from './fin-account-trans-detail.component';
import { FinAccountTransUpdateComponent } from './fin-account-trans-update.component';

@Injectable({ providedIn: 'root' })
export class FinAccountTransResolve implements Resolve<IFinAccountTrans> {
  constructor(private service: FinAccountTransService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinAccountTrans> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finAccountTrans: HttpResponse<FinAccountTrans>) => {
          if (finAccountTrans.body) {
            return of(finAccountTrans.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFinAccountTrans>) => res.body),
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
    const newItem = new FinAccountTrans();
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

export const finAccountTransRoute: Routes = [
  {
    path: '',
    component: FinAccountTransComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.finAccountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FinAccountTransDetailComponent,
    resolve: {
      finAccountTrans: FinAccountTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finAccountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FinAccountTransUpdateComponent,
    resolve: {
      content: FinAccountTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finAccountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FinAccountTransUpdateComponent,
    resolve: {
      content: FinAccountTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.finAccountTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
