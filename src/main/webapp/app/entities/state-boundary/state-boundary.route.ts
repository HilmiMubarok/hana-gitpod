import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IStateBoundary, StateBoundary } from './state-boundary.model';
import { StateBoundaryService } from './state-boundary.service';
import { StateBoundaryComponent } from './state-boundary.component';
import { StateBoundaryDetailComponent } from './state-boundary-detail.component';
import { StateBoundaryUpdateComponent } from './state-boundary-update.component';

@Injectable({ providedIn: 'root' })
export class StateBoundaryResolve implements Resolve<IStateBoundary> {
  constructor(private service: StateBoundaryService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStateBoundary> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stateBoundary: HttpResponse<StateBoundary>) => {
          if (stateBoundary.body) {
            return of(stateBoundary.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IStateBoundary>) => res.body),
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
    const newItem = new StateBoundary();
    const boundaryTypeId = route.queryParams['boundaryTypeId'] ? route.queryParams['boundaryTypeId'] : null;
    if (boundaryTypeId) {
      newItem.boundaryTypeId = boundaryTypeId;
    }
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const stateBoundaryRoute: Routes = [
  {
    path: '',
    component: StateBoundaryComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.stateBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StateBoundaryDetailComponent,
    resolve: {
      stateBoundary: StateBoundaryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.stateBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StateBoundaryUpdateComponent,
    resolve: {
      content: StateBoundaryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.stateBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StateBoundaryUpdateComponent,
    resolve: {
      content: StateBoundaryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.stateBoundary.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
