import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IUom, Uom } from './uom.model';
import { UomService } from './uom.service';
import { UomComponent } from './uom.component';
import { UomDetailComponent } from './uom-detail.component';
import { UomUpdateComponent } from './uom-update.component';

@Injectable({ providedIn: 'root' })
export class UomResolve implements Resolve<IUom> {
  constructor(private service: UomService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUom> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((uom: HttpResponse<Uom>) => {
          if (uom.body) {
            return of(uom.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IUom>) => res.body),
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
    const newItem = new Uom();
    const uomTypeId = route.queryParams['uomTypeId'] ? route.queryParams['uomTypeId'] : null;
    if (uomTypeId) {
      newItem.uomTypeId = uomTypeId;
    }
    return of(newItem);
  }
}

export const uomRoute: Routes = [
  {
    path: '',
    component: UomComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.uom.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UomDetailComponent,
    resolve: {
      uom: UomResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uom.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UomUpdateComponent,
    resolve: {
      content: UomResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uom.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UomUpdateComponent,
    resolve: {
      content: UomResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uom.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
