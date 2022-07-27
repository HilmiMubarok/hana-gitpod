import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICollateralProperty, CollateralProperty } from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import { CollateralPropertyComponent } from './collateral-property.component';
import { CollateralPropertyDetailComponent } from './collateral-property-detail.component';
import { CollateralPropertyUpdateComponent } from './collateral-property-update.component';

@Injectable({ providedIn: 'root' })
export class CollateralPropertyResolve implements Resolve<ICollateralProperty> {
  constructor(private service: CollateralPropertyService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollateralProperty> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collateralProperty: HttpResponse<CollateralProperty>) => {
          if (collateralProperty.body) {
            return of(collateralProperty.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICollateralProperty>) => res.body),
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
    const newItem = new CollateralProperty();
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const collateralId = route.queryParams['collateralId'] ? route.queryParams['collateralId'] : null;
    if (collateralId) {
      newItem.collateralId = collateralId;
    }
    const appraisalId = route.queryParams['appraisalId'] ? route.queryParams['appraisalId'] : null;
    if (appraisalId) {
      newItem.appraisalId = appraisalId;
    }
    return of(newItem);
  }
}

export const collateralPropertyRoute: Routes = [
  {
    path: '',
    component: CollateralPropertyComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.collateralProperty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollateralPropertyDetailComponent,
    resolve: {
      collateralProperty: CollateralPropertyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralProperty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollateralPropertyUpdateComponent,
    resolve: {
      content: CollateralPropertyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralProperty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollateralPropertyUpdateComponent,
    resolve: {
      content: CollateralPropertyResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralProperty.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
