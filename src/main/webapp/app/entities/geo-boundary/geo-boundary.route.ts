import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGeoBoundary, GeoBoundary } from './geo-boundary.model';
import { GeoBoundaryService } from './geo-boundary.service';
import { GeoBoundaryComponent } from './geo-boundary.component';
import { GeoBoundaryDetailComponent } from './geo-boundary-detail.component';
import { GeoBoundaryUpdateComponent } from './geo-boundary-update.component';

@Injectable({ providedIn: 'root' })
export class GeoBoundaryResolve implements Resolve<IGeoBoundary> {
  constructor(private service: GeoBoundaryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGeoBoundary> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((geoBoundary: HttpResponse<GeoBoundary>) => {
          if (geoBoundary.body) {
            return of(geoBoundary.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGeoBoundary>) => res.body),
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
    const newItem = new GeoBoundary();
    const boundaryTypeId = route.queryParams['boundaryTypeId'] ? route.queryParams['boundaryTypeId'] : null;
    if (boundaryTypeId) {
      newItem.boundaryTypeId = boundaryTypeId;
    }
    return of(newItem);
  }
}

export const geoBoundaryRoute: Routes = [
  {
    path: '',
    component: GeoBoundaryComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.geoBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GeoBoundaryDetailComponent,
    resolve: {
      geoBoundary: GeoBoundaryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.geoBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GeoBoundaryUpdateComponent,
    resolve: {
      content: GeoBoundaryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.geoBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GeoBoundaryUpdateComponent,
    resolve: {
      content: GeoBoundaryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.geoBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
