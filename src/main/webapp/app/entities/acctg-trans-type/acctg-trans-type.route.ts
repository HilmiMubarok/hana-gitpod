import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IAcctgTransType, AcctgTransType } from './acctg-trans-type.model';
import { AcctgTransTypeService } from './acctg-trans-type.service';
import { AcctgTransTypeComponent } from './acctg-trans-type.component';
import { AcctgTransTypeDetailComponent } from './acctg-trans-type-detail.component';
import { AcctgTransTypeUpdateComponent } from './acctg-trans-type-update.component';

@Injectable({ providedIn: 'root' })
export class AcctgTransTypeResolve implements Resolve<IAcctgTransType> {
  constructor(private service: AcctgTransTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAcctgTransType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((acctgTransType: HttpResponse<AcctgTransType>) => {
          if (acctgTransType.body) {
            return of(acctgTransType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IAcctgTransType>) => res.body),
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
    const newItem = new AcctgTransType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const acctgTransTypeRoute: Routes = [
  {
    path: '',
    component: AcctgTransTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.acctgTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AcctgTransTypeDetailComponent,
    resolve: {
      acctgTransType: AcctgTransTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AcctgTransTypeUpdateComponent,
    resolve: {
      content: AcctgTransTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AcctgTransTypeUpdateComponent,
    resolve: {
      content: AcctgTransTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.acctgTransType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
