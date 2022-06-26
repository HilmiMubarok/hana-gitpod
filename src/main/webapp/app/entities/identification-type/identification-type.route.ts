import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IIdentificationType, IdentificationType } from './identification-type.model';
import { IdentificationTypeService } from './identification-type.service';
import { IdentificationTypeComponent } from './identification-type.component';
import { IdentificationTypeDetailComponent } from './identification-type-detail.component';
import { IdentificationTypeUpdateComponent } from './identification-type-update.component';

@Injectable({ providedIn: 'root' })
export class IdentificationTypeResolve implements Resolve<IIdentificationType> {
  constructor(private service: IdentificationTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IIdentificationType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((identificationType: HttpResponse<IdentificationType>) => {
          if (identificationType.body) {
            return of(identificationType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IIdentificationType>) => res.body),
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
    const newItem = new IdentificationType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const identificationTypeRoute: Routes = [
  {
    path: '',
    component: IdentificationTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.identificationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdentificationTypeDetailComponent,
    resolve: {
      identificationType: IdentificationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.identificationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdentificationTypeUpdateComponent,
    resolve: {
      content: IdentificationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.identificationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdentificationTypeUpdateComponent,
    resolve: {
      content: IdentificationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.identificationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
