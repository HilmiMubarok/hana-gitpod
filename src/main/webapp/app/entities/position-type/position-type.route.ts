import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPositionType, PositionType } from './position-type.model';
import { PositionTypeService } from './position-type.service';
import { PositionTypeComponent } from './position-type.component';
import { PositionTypeDetailComponent } from './position-type-detail.component';
import { PositionTypeUpdateComponent } from './position-type-update.component';
import { PositionTypeViewComponent } from './position-type-view.component';

@Injectable({ providedIn: 'root' })
export class PositionTypeResolve implements Resolve<IPositionType> {
  constructor(private service: PositionTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPositionType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((positionType: HttpResponse<PositionType>) => {
          if (positionType.body) {
            return of(positionType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPositionType>) => res.body),
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
    const newItem = new PositionType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const internalTypeId = route.queryParams['internalTypeId'] ? route.queryParams['internalTypeId'] : null;
    if (internalTypeId) {
      newItem.internalTypeId = internalTypeId;
    }
    return of(newItem);
  }
}

export const positionTypeRoute: Routes = [
  {
    path: '',
    component: PositionTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.positionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionTypeViewComponent,
    resolve: {
      positionType: PositionTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.positionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionTypeUpdateComponent,
    resolve: {
      content: PositionTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.positionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionTypeUpdateComponent,
    resolve: {
      content: PositionTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.positionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
