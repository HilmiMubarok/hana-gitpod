import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPosition, Position } from './position.model';
import { PositionService } from './position.service';
import { PositionComponent } from './position.component';
import { PositionDetailComponent } from './position-detail.component';
import { PositionUpdateComponent } from './position-update.component';

@Injectable({ providedIn: 'root' })
export class PositionResolve implements Resolve<IPosition> {
  constructor(private service: PositionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPosition> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((position: HttpResponse<Position>) => {
          if (position.body) {
            return of(position.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPosition>) => res.body),
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
    const newItem = new Position();
    const positionTypeId = route.queryParams['positionTypeId'] ? route.queryParams['positionTypeId'] : null;
    if (positionTypeId) {
      newItem.positionTypeId = positionTypeId;
    }
    const employeeId = route.queryParams['employeeId'] ? route.queryParams['employeeId'] : null;
    if (employeeId) {
      newItem.employeeId = employeeId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const positionRoute: Routes = [
  {
    path: '',
    component: PositionComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.position.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionDetailComponent,
    resolve: {
      position: PositionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.position.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionUpdateComponent,
    resolve: {
      content: PositionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.position.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionUpdateComponent,
    resolve: {
      content: PositionResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.position.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
