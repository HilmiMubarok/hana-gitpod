import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGoodIdentification, GoodIdentification } from './good-identification.model';
import { GoodIdentificationService } from './good-identification.service';
import { GoodIdentificationComponent } from './good-identification.component';
import { GoodIdentificationDetailComponent } from './good-identification-detail.component';
import { GoodIdentificationUpdateComponent } from './good-identification-update.component';

@Injectable({ providedIn: 'root' })
export class GoodIdentificationResolve implements Resolve<IGoodIdentification> {
  constructor(private service: GoodIdentificationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGoodIdentification> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((goodIdentification: HttpResponse<GoodIdentification>) => {
          if (goodIdentification.body) {
            return of(goodIdentification.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGoodIdentification>) => res.body),
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
    const newItem = new GoodIdentification();
    const identificationId = route.queryParams['identificationId'] ? route.queryParams['identificationId'] : null;
    if (identificationId) {
      newItem.identificationId = identificationId;
    }
    const productId = route.queryParams['productId'] ? route.queryParams['productId'] : null;
    if (productId) {
      newItem.productId = productId;
    }
    return of(newItem);
  }
}

export const goodIdentificationRoute: Routes = [
  {
    path: '',
    component: GoodIdentificationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.goodIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GoodIdentificationDetailComponent,
    resolve: {
      goodIdentification: GoodIdentificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.goodIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GoodIdentificationUpdateComponent,
    resolve: {
      content: GoodIdentificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.goodIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GoodIdentificationUpdateComponent,
    resolve: {
      content: GoodIdentificationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.goodIdentification.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
