import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IBaseApplication, BaseApplication } from './base-application.model';
import { BaseApplicationService } from './base-application.service';
import { BaseApplicationComponent } from './base-application.component';
import { BaseApplicationDetailComponent } from './base-application-detail.component';
import { BaseApplicationUpdateComponent } from './base-application-update.component';

@Injectable({ providedIn: 'root' })
export class BaseApplicationResolve implements Resolve<IBaseApplication> {
  constructor(private service: BaseApplicationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBaseApplication> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((baseApplication: HttpResponse<BaseApplication>) => {
          if (baseApplication.body) {
            return of(baseApplication.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IBaseApplication>) => res.body),
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
    const newItem = new BaseApplication();
    const applicationTypeId = route.queryParams['applicationTypeId'] ? route.queryParams['applicationTypeId'] : null;
    if (applicationTypeId) {
      newItem.applicationTypeId = applicationTypeId;
    }
    const internalId = route.queryParams['internalId'] ? route.queryParams['internalId'] : null;
    if (internalId) {
      newItem.internalId = internalId;
    }
    return of(newItem);
  }
}

export const baseApplicationRoute: Routes = [
  {
    path: '',
    component: BaseApplicationComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.baseApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BaseApplicationDetailComponent,
    resolve: {
      baseApplication: BaseApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.baseApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BaseApplicationUpdateComponent,
    resolve: {
      content: BaseApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.baseApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BaseApplicationUpdateComponent,
    resolve: {
      content: BaseApplicationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.baseApplication.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
