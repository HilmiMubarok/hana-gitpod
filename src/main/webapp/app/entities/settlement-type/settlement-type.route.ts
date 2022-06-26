import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ISettlementType, SettlementType } from './settlement-type.model';
import { SettlementTypeService } from './settlement-type.service';
import { SettlementTypeComponent } from './settlement-type.component';
import { SettlementTypeDetailComponent } from './settlement-type-detail.component';
import { SettlementTypeUpdateComponent } from './settlement-type-update.component';

@Injectable({ providedIn: 'root' })
export class SettlementTypeResolve implements Resolve<ISettlementType> {
  constructor(private service: SettlementTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISettlementType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((settlementType: HttpResponse<SettlementType>) => {
          if (settlementType.body) {
            return of(settlementType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ISettlementType>) => res.body),
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
    const newItem = new SettlementType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const settlementTypeRoute: Routes = [
  {
    path: '',
    component: SettlementTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.settlementType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SettlementTypeDetailComponent,
    resolve: {
      settlementType: SettlementTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.settlementType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SettlementTypeUpdateComponent,
    resolve: {
      content: SettlementTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.settlementType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SettlementTypeUpdateComponent,
    resolve: {
      content: SettlementTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.settlementType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
