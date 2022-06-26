import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IUomConversion, UomConversion } from './uom-conversion.model';
import { UomConversionService } from './uom-conversion.service';
import { UomConversionComponent } from './uom-conversion.component';
import { UomConversionDetailComponent } from './uom-conversion-detail.component';
import { UomConversionUpdateComponent } from './uom-conversion-update.component';

@Injectable({ providedIn: 'root' })
export class UomConversionResolve implements Resolve<IUomConversion> {
  constructor(private service: UomConversionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUomConversion> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((uomConversion: HttpResponse<UomConversion>) => {
          if (uomConversion.body) {
            return of(uomConversion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IUomConversion>) => res.body),
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
    const newItem = new UomConversion();
    const uomToId = route.queryParams['uomToId'] ? route.queryParams['uomToId'] : null;
    if (uomToId) {
      newItem.uomToId = uomToId;
    }
    const uomFromId = route.queryParams['uomFromId'] ? route.queryParams['uomFromId'] : null;
    if (uomFromId) {
      newItem.uomFromId = uomFromId;
    }
    return of(newItem);
  }
}

export const uomConversionRoute: Routes = [
  {
    path: '',
    component: UomConversionComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.uomConversion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UomConversionDetailComponent,
    resolve: {
      uomConversion: UomConversionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uomConversion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UomConversionUpdateComponent,
    resolve: {
      content: UomConversionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uomConversion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UomConversionUpdateComponent,
    resolve: {
      content: UomConversionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.uomConversion.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
