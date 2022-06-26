import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFacility, Facility } from './facility.model';
import { FacilityService } from './facility.service';
import { FacilityComponent } from './facility.component';
import { FacilityDetailComponent } from './facility-detail.component';
import { FacilityUpdateComponent } from './facility-update.component';

@Injectable({ providedIn: 'root' })
export class FacilityResolve implements Resolve<IFacility> {
  constructor(private service: FacilityService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFacility> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((facility: HttpResponse<Facility>) => {
          if (facility.body) {
            return of(facility.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFacility>) => res.body),
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
    const newItem = new Facility();
    const facilityTypeId = route.queryParams['facilityTypeId'] ? route.queryParams['facilityTypeId'] : null;
    if (facilityTypeId) {
      newItem.facilityTypeId = facilityTypeId;
    }
    const partOfId = route.queryParams['partOfId'] ? route.queryParams['partOfId'] : null;
    if (partOfId) {
      newItem.partOfId = partOfId;
    }
    return of(newItem);
  }
}

export const facilityRoute: Routes = [
  {
    path: '',
    component: FacilityComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.facility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacilityDetailComponent,
    resolve: {
      facility: FacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.facility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacilityUpdateComponent,
    resolve: {
      content: FacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.facility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacilityUpdateComponent,
    resolve: {
      content: FacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.facility.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
