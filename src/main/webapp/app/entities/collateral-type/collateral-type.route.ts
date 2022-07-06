import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICollateralType, CollateralType } from './collateral-type.model';
import { CollateralTypeService } from './collateral-type.service';
import { CollateralTypeComponent } from './collateral-type.component';
import { CollateralTypeDetailComponent } from './collateral-type-detail.component';
import { CollateralTypeUpdateComponent } from './collateral-type-update.component';

@Injectable({ providedIn: 'root' })
export class CollateralTypeResolve implements Resolve<ICollateralType> {
  constructor(private service: CollateralTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICollateralType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((collateralType: HttpResponse<CollateralType>) => {
          if (collateralType.body) {
            return of(collateralType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICollateralType>) => res.body),
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
    const newItem = new CollateralType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const collateralTypeRoute: Routes = [
  {
    path: '',
    component: CollateralTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.collateralType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CollateralTypeDetailComponent,
    resolve: {
      collateralType: CollateralTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CollateralTypeUpdateComponent,
    resolve: {
      content: CollateralTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CollateralTypeUpdateComponent,
    resolve: {
      content: CollateralTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
