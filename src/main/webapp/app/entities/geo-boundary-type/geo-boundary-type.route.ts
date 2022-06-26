import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGeoBoundaryType, GeoBoundaryType } from './geo-boundary-type.model';
import { GeoBoundaryTypeService } from './geo-boundary-type.service';
import { GeoBoundaryTypeComponent } from './geo-boundary-type.component';
import { GeoBoundaryTypeDetailComponent } from './geo-boundary-type-detail.component';
import { GeoBoundaryTypeUpdateComponent } from './geo-boundary-type-update.component';

@Injectable({ providedIn: 'root' })
export class GeoBoundaryTypeResolve implements Resolve<IGeoBoundaryType> {
  constructor(private service: GeoBoundaryTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGeoBoundaryType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((geoBoundaryType: HttpResponse<GeoBoundaryType>) => {
          if (geoBoundaryType.body) {
            return of(geoBoundaryType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGeoBoundaryType>) => res.body),
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
    const newItem = new GeoBoundaryType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const geoBoundaryTypeRoute: Routes = [
  {
    path: '',
    component: GeoBoundaryTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.geoBoundaryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GeoBoundaryTypeDetailComponent,
    resolve: {
      geoBoundaryType: GeoBoundaryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.geoBoundaryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GeoBoundaryTypeUpdateComponent,
    resolve: {
      content: GeoBoundaryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.geoBoundaryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GeoBoundaryTypeUpdateComponent,
    resolve: {
      content: GeoBoundaryTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.geoBoundaryType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
