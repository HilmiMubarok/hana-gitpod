import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAcctgTrans, AcctgTrans } from './acctg-trans.model';
import { AcctgTransService } from './acctg-trans.service';
import { AcctgTransComponent } from './acctg-trans.component';
import { AcctgTransDetailComponent } from './acctg-trans-detail.component';
import { AcctgTransUpdateComponent } from './acctg-trans-update.component';

@Injectable({ providedIn: 'root' })
export class AcctgTransResolve implements Resolve<IAcctgTrans> {
  constructor(private service: AcctgTransService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAcctgTrans> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((acctgTrans: HttpResponse<AcctgTrans>) => {
          if (acctgTrans.body) {
            return of(acctgTrans.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAcctgTrans>) => res.body),
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
    const newItem = new AcctgTrans();
    const transTypeId = route.queryParams['transTypeId'] ? route.queryParams['transTypeId'] : null;
    if (transTypeId) {
      newItem.transTypeId = transTypeId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const acctgTransRoute: Routes = [
  {
    path: '',
    component: AcctgTransComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.acctgTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AcctgTransDetailComponent,
    resolve: {
      acctgTrans: AcctgTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AcctgTransUpdateComponent,
    resolve: {
      content: AcctgTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AcctgTransUpdateComponent,
    resolve: {
      content: AcctgTransResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTrans.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
