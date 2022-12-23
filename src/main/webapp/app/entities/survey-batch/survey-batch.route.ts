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
import { OfferingLetterSurveyBatchComponent } from './offering-letter-survey-batch/offering-letter-survey-batch.component';
import { OfferingLetterSurveyBatchNewComponent } from './offering-letter-survey-batch/offering-letter-survey-batch-new.component';
import { OfferingLetterSurveyBatchViewComponent } from './offering-letter-survey-batch/offering-letter-survey-batch-view.component';
import { CollateralAppraisalResolve } from '../collateral-appraisal/collateral-appraisal.route';
import { SurveyBatchCollateralAppraisalMainComponent } from './survey-batch-collateral-appraisal-main.component';
import { CollateralAppraisalMaterialExternalComponent } from './collateral-appraisal-material-external.component';
import { SurveyBatchEditComponent } from './survey-batch-edit.component';
import { CollateralAppraisalMaterialInternalComponent } from './collateral-appraisal-material-internal.component';
import { CollateralAppraisalMaterialProcessComponent } from './collateral-appraisal-material-process.component';
import { CollateralAppraisalMaterialApprovalComponent } from './collateral-appraisal-material-approval.component';
import { CollateralAppraisalMaterialInquiryComponent } from './collateral-appraisal-material-inquiry.component';
import { SurveyBatchEditInternalComponent } from './survey-batch-edit-internal.component';
import { SurveyBatchEditProcessComponent } from './survey-batch-edit-process.component';
import { SurveyBatchEditApprovalComponent } from './survey-batch-edit-approval.component';

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
    component: CollateralAppraisalMaterialExternalComponent,
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
    path: 'internal',
    component: CollateralAppraisalMaterialInternalComponent,
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
    path: 'process',
    component: CollateralAppraisalMaterialProcessComponent,
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
    path: 'approval',
    component: CollateralAppraisalMaterialApprovalComponent,
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
    path: 'inquiry',
    component: CollateralAppraisalMaterialInquiryComponent,
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
    path: 'offering-letter',
    component: OfferingLetterSurveyBatchComponent,
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
    path: 'offering-letter/survey-request/new',
    component: OfferingLetterSurveyBatchNewComponent,
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
    path: ':id/viewOffering',
    component: OfferingLetterSurveyBatchViewComponent,
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
    path: 'survey-batch/new',
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
  {
    path: ':id/edit-external',
    component: SurveyBatchEditComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit-internal',
    component: SurveyBatchEditInternalComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit-process',
    component: SurveyBatchEditProcessComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit-approval',
    component: SurveyBatchEditApprovalComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'survey-batch',
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
    path: ':id/editNew',
    component: SurveyBatchCollateralAppraisalMainComponent,
    resolve: {
      content: CollateralAppraisalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/editNew/:idParent',
    component: SurveyBatchCollateralAppraisalMainComponent,
    resolve: {
      content: CollateralAppraisalResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.collateralAppraisal.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
