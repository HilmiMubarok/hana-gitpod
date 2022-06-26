import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFeatureType, FeatureType } from './feature-type.model';
import { FeatureTypeService } from './feature-type.service';
import { FeatureTypeComponent } from './feature-type.component';
import { FeatureTypeDetailComponent } from './feature-type-detail.component';
import { FeatureTypeUpdateComponent } from './feature-type-update.component';

@Injectable({ providedIn: 'root' })
export class FeatureTypeResolve implements Resolve<IFeatureType> {
  constructor(private service: FeatureTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeatureType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((featureType: HttpResponse<FeatureType>) => {
          if (featureType.body) {
            return of(featureType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFeatureType>) => res.body),
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
    const newItem = new FeatureType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const featureTypeRoute: Routes = [
  {
    path: '',
    component: FeatureTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.featureType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeatureTypeDetailComponent,
    resolve: {
      featureType: FeatureTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.featureType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeatureTypeUpdateComponent,
    resolve: {
      content: FeatureTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.featureType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeatureTypeUpdateComponent,
    resolve: {
      content: FeatureTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.featureType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
