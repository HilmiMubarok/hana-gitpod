import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICreditFacility, CreditFacility } from './credit-facility.model';
import { CreditFacilityService } from './credit-facility.service';
import { CreditFacilityComponent } from './credit-facility.component';
import { CreditFacilityDetailComponent } from './credit-facility-detail.component';
import { CreditFacilityUpdateComponent } from './credit-facility-update.component';

@Injectable({ providedIn: 'root' })
export class CreditFacilityResolve implements Resolve<ICreditFacility> {
  constructor(private service: CreditFacilityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditFacility> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditFacility: HttpResponse<CreditFacility>) => {
          if (creditFacility.body) {
            return of(creditFacility.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICreditFacility>) => res.body),
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
    const newItem = new CreditFacility();
    const productTypeId = route.queryParams['productTypeId'] ? route.queryParams['productTypeId'] : null;
    if (productTypeId) {
      newItem.productTypeId = productTypeId;
    }
    return of(newItem);
  }
}

export const creditFacilityRoute: Routes = [
  {
    path: '',
    component: CreditFacilityComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.creditFacility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreditFacilityDetailComponent,
    resolve: {
      creditFacility: CreditFacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditFacility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreditFacilityUpdateComponent,
    resolve: {
      content: CreditFacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditFacility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreditFacilityUpdateComponent,
    resolve: {
      content: CreditFacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.creditFacility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
