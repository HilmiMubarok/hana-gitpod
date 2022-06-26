import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAcctgTransItem, AcctgTransItem } from './acctg-trans-item.model';
import { AcctgTransItemService } from './acctg-trans-item.service';
import { AcctgTransItemComponent } from './acctg-trans-item.component';
import { AcctgTransItemDetailComponent } from './acctg-trans-item-detail.component';
import { AcctgTransItemUpdateComponent } from './acctg-trans-item-update.component';

@Injectable({ providedIn: 'root' })
export class AcctgTransItemResolve implements Resolve<IAcctgTransItem> {
  constructor(private service: AcctgTransItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAcctgTransItem> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((acctgTransItem: HttpResponse<AcctgTransItem>) => {
          if (acctgTransItem.body) {
            return of(acctgTransItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAcctgTransItem>) => res.body),
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
    const newItem = new AcctgTransItem();
    const transId = route.queryParams['transId'] ? route.queryParams['transId'] : null;
    if (transId) {
      newItem.transId = transId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    const accountId = route.queryParams['accountId'] ? route.queryParams['accountId'] : null;
    if (accountId) {
      newItem.accountId = accountId;
    }
    const periodId = route.queryParams['periodId'] ? route.queryParams['periodId'] : null;
    if (periodId) {
      newItem.periodId = periodId;
    }
    return of(newItem);
  }
}

export const acctgTransItemRoute: Routes = [
  {
    path: '',
    component: AcctgTransItemComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.acctgTransItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AcctgTransItemDetailComponent,
    resolve: {
      acctgTransItem: AcctgTransItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTransItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AcctgTransItemUpdateComponent,
    resolve: {
      content: AcctgTransItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTransItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AcctgTransItemUpdateComponent,
    resolve: {
      content: AcctgTransItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTransItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
