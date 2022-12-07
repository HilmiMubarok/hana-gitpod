import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPositionReportingStructure, PositionReportingStructure } from './position-reporting-structure.model';
import { PositionReportingStructureService } from './position-reporting-structure.service';
import { PositionReportingStructureComponent } from './position-reporting-structure.component';
import { PositionReportingStructureDetailComponent } from './position-reporting-structure-detail.component';
import { PositionReportingStructureUpdateComponent } from './position-reporting-structure-update.component';

@Injectable({ providedIn: 'root' })
export class PositionReportingStructureResolve implements Resolve<IPositionReportingStructure> {
  constructor(private service: PositionReportingStructureService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPositionReportingStructure> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((positionReportingStructure: HttpResponse<PositionReportingStructure>) => {
          if (positionReportingStructure.body) {
            return of(positionReportingStructure.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPositionReportingStructure>) => res.body),
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
    const newItem = new PositionReportingStructure();
    const relationTypeId = route.queryParams['relationTypeId'] ? route.queryParams['relationTypeId'] : null;
    if (relationTypeId) {
      newItem.relationTypeId = relationTypeId;
    }
    const positionFromId = route.queryParams['positionFromId'] ? route.queryParams['positionFromId'] : null;
    if (positionFromId) {
      newItem.positionFromId = positionFromId;
    }
    const positionToId = route.queryParams['positionToId'] ? route.queryParams['positionToId'] : null;
    if (positionToId) {
      newItem.positionToId = positionToId;
    }
    return of(newItem);
  }
}

export const positionReportingStructureRoute: Routes = [
  {
    path: '',
    component: PositionReportingStructureComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.positionReportingStructure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PositionReportingStructureDetailComponent,
    resolve: {
      positionReportingStructure: PositionReportingStructureResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.positionReportingStructure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PositionReportingStructureUpdateComponent,
    resolve: {
      content: PositionReportingStructureResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.positionReportingStructure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PositionReportingStructureUpdateComponent,
    resolve: {
      content: PositionReportingStructureResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.positionReportingStructure.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
