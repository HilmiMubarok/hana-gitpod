import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IGood, Good } from './good.model';
import { GoodService } from './good.service';
import { GoodComponent } from './good.component';
import { GoodDetailComponent } from './good-detail.component';
import { GoodUpdateComponent } from './good-update.component';

@Injectable({ providedIn: 'root' })
export class GoodResolve implements Resolve<IGood> {
  constructor(private service: GoodService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGood> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((good: HttpResponse<Good>) => {
          if (good.body) {
            return of(good.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IGood>) => res.body),
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
    const newItem = new Good();
    const productTypeId = route.queryParams['productTypeId'] ? route.queryParams['productTypeId'] : null;
    if (productTypeId) {
      newItem.productTypeId = productTypeId;
    }
    const configId = route.queryParams['configId'] ? route.queryParams['configId'] : null;
    if (configId) {
      newItem.configId = configId;
    }
    return of(newItem);
  }
}

export const goodRoute: Routes = [
  {
    path: '',
    component: GoodComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.good.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GoodDetailComponent,
    resolve: {
      good: GoodResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.good.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GoodUpdateComponent,
    resolve: {
      content: GoodResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.good.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GoodUpdateComponent,
    resolve: {
      content: GoodResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.good.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
