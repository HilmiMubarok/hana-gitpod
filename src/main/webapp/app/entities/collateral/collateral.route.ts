import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICollateral, Collateral } from './collateral.model';
import { CollateralService } from './collateral.service';
import { CollateralComponent } from './collateral.component';
import { CollateralDetailComponent } from './collateral-detail.component';
import { CollateralUpdateComponent } from './collateral-update.component';

@Injectable({ providedIn: 'root' })
export class CollateralResolve implements Resolve<ICollateral> {
  constructor(private service: CollateralService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollateral> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collateral: HttpResponse<Collateral>) => {
          if (collateral.body) {
            return of(collateral.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICollateral>) => res.body),
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
    const newItem = new Collateral();
    const collateralTypeId = route.queryParams['collateralTypeId'] ? route.queryParams['collateralTypeId'] : null;
    if (collateralTypeId) {
      newItem.collateralTypeId = collateralTypeId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const applicationId = route.queryParams['applicationId'] ? route.queryParams['applicationId'] : null;
    if (applicationId) {
      newItem.applicationId = applicationId;
    }
    return of(newItem);
  }
}

export const collateralRoute: Routes = [
  {
    path: '',
    component: CollateralComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.collateral.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollateralDetailComponent,
    resolve: {
      collateral: CollateralResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateral.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollateralUpdateComponent,
    resolve: {
      content: CollateralResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateral.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollateralUpdateComponent,
    resolve: {
      content: CollateralResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateral.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
