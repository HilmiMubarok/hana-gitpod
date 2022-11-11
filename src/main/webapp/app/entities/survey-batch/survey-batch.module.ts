import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyBatchComponent } from './survey-batch.component';
import { SurveyBatchDetailComponent } from './survey-batch-detail.component';
import { SurveyBatchUpdateComponent } from './survey-batch-update.component';
import { surveyBatchRoute } from './survey-batch.route';
import { SurveyBatchAppraisalComponent } from './survey-batch-appraisal.component';
import { SurveyBatchCreateComponent } from './survey-batch-create.component';
import { ReportIndependentComponent } from './report-independent/report-independent.component';
import { SurveyBatchCollateralAppraisalMainComponent } from './survey-batch-collateral-appraisal-main.component';
import { DocumentUploadDialogSurveyBatchComponent } from './document-upload-dialog-survey-batch.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(surveyBatchRoute)],
  declarations: [
    SurveyBatchComponent,
    SurveyBatchDetailComponent,
    SurveyBatchUpdateComponent,
    SurveyBatchAppraisalComponent,
    SurveyBatchCreateComponent,
    SurveyBatchCollateralAppraisalMainComponent,
    ReportIndependentComponent,
    DocumentUploadDialogSurveyBatchComponent,
  ],
  entryComponents: [SurveyBatchComponent, SurveyBatchUpdateComponent, ReportIndependentComponent, DocumentUploadDialogSurveyBatchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSurveyBatchModule {}
