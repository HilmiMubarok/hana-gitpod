import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IApplicationType, ApplicationType } from './application-type.model';
import { ApplicationTypeService } from './application-type.service';
import { ApplicationTypeComponent } from './application-type.component';
import { ApplicationTypeDetailComponent } from './application-type-detail.component';
import { ApplicationTypeUpdateComponent } from './application-type-update.component';

@Injectable({ providedIn: 'root' })
export class ApplicationTypeResolve implements Resolve<IApplicationType> {
  constructor(private service: ApplicationTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((applicationType: HttpResponse<ApplicationType>) => {
          if (applicationType.body) {
            return of(applicationType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IApplicationType>) => res.body),
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
    const newItem = new ApplicationType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    return of(newItem);
  }
}

export const applicationTypeRoute: Routes = [
  {
    path: '',
    component: ApplicationTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.applicationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationTypeDetailComponent,
    resolve: {
      applicationType: ApplicationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.applicationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationTypeUpdateComponent,
    resolve: {
      content: ApplicationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.applicationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationTypeUpdateComponent,
    resolve: {
      content: ApplicationTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.applicationType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
