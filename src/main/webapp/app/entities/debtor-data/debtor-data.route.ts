import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IDebtorData, DebtorData } from './debtor-data.model';
import { DebtorDataService } from './debtor-data.service';
import { DebtorDataComponent } from './debtor-data.component';
import { DebtorDataDetailComponent } from './debtor-data-detail.component';
import { DebtorDataUpdateComponent } from './debtor-data-update.component';

@Injectable({ providedIn: 'root' })
export class DebtorDataResolve implements Resolve<IDebtorData> {
  constructor(private service: DebtorDataService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDebtorData> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((debtorData: HttpResponse<DebtorData>) => {
          if (debtorData.body) {
            return of(debtorData.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IDebtorData>) => res.body),
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
    const newItem = new DebtorData();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    return of(newItem);
  }
}

export const debtorDataRoute: Routes = [
  {
    path: '',
    component: DebtorDataComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.debtorData.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DebtorDataDetailComponent,
    resolve: {
      debtorData: DebtorDataResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.debtorData.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DebtorDataUpdateComponent,
    resolve: {
      content: DebtorDataResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.debtorData.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DebtorDataUpdateComponent,
    resolve: {
      content: DebtorDataResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.debtorData.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
