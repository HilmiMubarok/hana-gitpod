import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ISurveyBatch, SurveyBatch } from './survey-batch.model';
import { SurveyBatchService } from './survey-batch.service';
import { SurveyBatchComponent } from './survey-batch.component';
import { SurveyBatchDetailComponent } from './survey-batch-detail.component';
import { SurveyBatchUpdateComponent } from './survey-batch-update.component';
import { SurveyBatchAppraisalComponent } from './survey-batch-appraisal.component';
import { SurveyBatchCreateComponent } from './survey-batch-create.component';

@Injectable({ providedIn: 'root' })
export class SurveyBatchResolve implements Resolve<ISurveyBatch> {
  constructor(private service: SurveyBatchService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISurveyBatch> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((surveyBatch: HttpResponse<SurveyBatch>) => {
          if (surveyBatch.body) {
            return of(surveyBatch.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ISurveyBatch>) => res.body),
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
    const newItem = new SurveyBatch();
    return of(newItem);
  }
}

export const surveyBatchRoute: Routes = [
  {
    path: '',
    component: SurveyBatchAppraisalComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.surveyBatch.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SurveyBatchDetailComponent,
    resolve: {
      surveyBatch: SurveyBatchResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.surveyBatch.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SurveyBatchCreateComponent,
    resolve: {
      content: SurveyBatchResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.surveyBatch.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SurveyBatchUpdateComponent,
    resolve: {
      content: SurveyBatchResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.surveyBatch.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
