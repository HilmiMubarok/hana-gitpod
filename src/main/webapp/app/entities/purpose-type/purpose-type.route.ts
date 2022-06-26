import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPurposeType, PurposeType } from './purpose-type.model';
import { PurposeTypeService } from './purpose-type.service';
import { PurposeTypeComponent } from './purpose-type.component';
import { PurposeTypeDetailComponent } from './purpose-type-detail.component';
import { PurposeTypeUpdateComponent } from './purpose-type-update.component';

@Injectable({ providedIn: 'root' })
export class PurposeTypeResolve implements Resolve<IPurposeType> {
  constructor(private service: PurposeTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurposeType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((purposeType: HttpResponse<PurposeType>) => {
          if (purposeType.body) {
            return of(purposeType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPurposeType>) => res.body),
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
    const newItem = new PurposeType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const purposeTypeRoute: Routes = [
  {
    path: '',
    component: PurposeTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.purposeType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PurposeTypeDetailComponent,
    resolve: {
      purposeType: PurposeTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.purposeType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PurposeTypeUpdateComponent,
    resolve: {
      content: PurposeTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.purposeType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PurposeTypeUpdateComponent,
    resolve: {
      content: PurposeTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.purposeType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
