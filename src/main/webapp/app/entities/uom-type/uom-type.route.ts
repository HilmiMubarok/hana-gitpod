import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IUomType, UomType } from './uom-type.model';
import { UomTypeService } from './uom-type.service';
import { UomTypeComponent } from './uom-type.component';
import { UomTypeDetailComponent } from './uom-type-detail.component';
import { UomTypeUpdateComponent } from './uom-type-update.component';

@Injectable({ providedIn: 'root' })
export class UomTypeResolve implements Resolve<IUomType> {
  constructor(private service: UomTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUomType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((uomType: HttpResponse<UomType>) => {
          if (uomType.body) {
            return of(uomType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IUomType>) => res.body),
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
    const newItem = new UomType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const uomTypeRoute: Routes = [
  {
    path: '',
    component: UomTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.uomType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UomTypeDetailComponent,
    resolve: {
      uomType: UomTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uomType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UomTypeUpdateComponent,
    resolve: {
      content: UomTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uomType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UomTypeUpdateComponent,
    resolve: {
      content: UomTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uomType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
