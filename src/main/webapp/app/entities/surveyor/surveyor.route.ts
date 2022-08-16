import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ISurveyor, Surveyor } from './surveyor.model';
import { SurveyorService } from './surveyor.service';
import { SurveyorComponent } from './surveyor.component';
import { SurveyorDetailComponent } from './surveyor-detail.component';
import { SurveyorUpdateComponent } from './surveyor-update.component';

@Injectable({ providedIn: 'root' })
export class SurveyorResolve implements Resolve<ISurveyor> {
  constructor(private service: SurveyorService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISurveyor> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((surveyor: HttpResponse<Surveyor>) => {
          if (surveyor.body) {
            return of(surveyor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ISurveyor>) => res.body),
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
    const newItem = new Surveyor();
    const roleId = route.queryParams['roleId'] ? route.queryParams['roleId'] : null;
    if (roleId) {
      newItem.roleId = roleId;
    }
    const personId = route.queryParams['personId'] ? route.queryParams['personId'] : null;
    if (personId) {
      newItem.personId = personId;
    }
    return of(newItem);
  }
}

export const surveyorRoute: Routes = [
  {
    path: '',
    component: SurveyorComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.surveyor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SurveyorDetailComponent,
    resolve: {
      surveyor: SurveyorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.surveyor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SurveyorUpdateComponent,
    resolve: {
      content: SurveyorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.surveyor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SurveyorUpdateComponent,
    resolve: {
      content: SurveyorResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.surveyor.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
