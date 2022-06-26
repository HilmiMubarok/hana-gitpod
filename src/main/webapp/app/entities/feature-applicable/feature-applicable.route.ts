import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IFeatureApplicable, FeatureApplicable } from './feature-applicable.model';
import { FeatureApplicableService } from './feature-applicable.service';
import { FeatureApplicableComponent } from './feature-applicable.component';
import { FeatureApplicableDetailComponent } from './feature-applicable-detail.component';
import { FeatureApplicableUpdateComponent } from './feature-applicable-update.component';

@Injectable({ providedIn: 'root' })
export class FeatureApplicableResolve implements Resolve<IFeatureApplicable> {
  constructor(private service: FeatureApplicableService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFeatureApplicable> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((featureApplicable: HttpResponse<FeatureApplicable>) => {
          if (featureApplicable.body) {
            return of(featureApplicable.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IFeatureApplicable>) => res.body),
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
    const newItem = new FeatureApplicable();
    const featureId = route.queryParams['featureId'] ? route.queryParams['featureId'] : null;
    if (featureId) {
      newItem.featureId = featureId;
    }
    const productId = route.queryParams['productId'] ? route.queryParams['productId'] : null;
    if (productId) {
      newItem.productId = productId;
    }
    return of(newItem);
  }
}

export const featureApplicableRoute: Routes = [
  {
    path: '',
    component: FeatureApplicableComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.featureApplicable.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeatureApplicableDetailComponent,
    resolve: {
      featureApplicable: FeatureApplicableResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.featureApplicable.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeatureApplicableUpdateComponent,
    resolve: {
      content: FeatureApplicableResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.featureApplicable.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeatureApplicableUpdateComponent,
    resolve: {
      content: FeatureApplicableResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.featureApplicable.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
