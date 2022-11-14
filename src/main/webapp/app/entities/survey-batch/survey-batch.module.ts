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
import { OfferingLetterSurveyBatchComponent } from './offering-letter-survey-batch/offering-letter-survey-batch.component';
import { OfferingLetterSurveyBatchNewComponent } from './offering-letter-survey-batch/offering-letter-survey-batch-new.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(surveyBatchRoute)],
  declarations: [
    SurveyBatchComponent,
    SurveyBatchDetailComponent,
    SurveyBatchUpdateComponent,
    SurveyBatchAppraisalComponent,
    SurveyBatchCreateComponent,
    OfferingLetterSurveyBatchComponent,
    OfferingLetterSurveyBatchNewComponent
  ],
  entryComponents: [SurveyBatchComponent, SurveyBatchUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSurveyBatchModule {}
