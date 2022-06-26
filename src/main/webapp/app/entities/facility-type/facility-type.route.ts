import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFacilityType, FacilityType } from './facility-type.model';
import { FacilityTypeService } from './facility-type.service';
import { FacilityTypeComponent } from './facility-type.component';
import { FacilityTypeDetailComponent } from './facility-type-detail.component';
import { FacilityTypeUpdateComponent } from './facility-type-update.component';

@Injectable({ providedIn: 'root' })
export class FacilityTypeResolve implements Resolve<IFacilityType> {
  constructor(private service: FacilityTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFacilityType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((facilityType: HttpResponse<FacilityType>) => {
          if (facilityType.body) {
            return of(facilityType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFacilityType>) => res.body),
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
    const newItem = new FacilityType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const facilityTypeRoute: Routes = [
  {
    path: '',
    component: FacilityTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.facilityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacilityTypeDetailComponent,
    resolve: {
      facilityType: FacilityTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.facilityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacilityTypeUpdateComponent,
    resolve: {
      content: FacilityTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.facilityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacilityTypeUpdateComponent,
    resolve: {
      content: FacilityTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.facilityType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
