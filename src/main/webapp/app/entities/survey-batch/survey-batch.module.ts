import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyBatchComponent } from './survey-batch.component';
import { SurveyBatchDetailComponent } from './survey-batch-detail.component';
import { SurveyBatchUpdateComponent } from './survey-batch-update.component';
import { surveyBatchRoute } from './survey-batch.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(surveyBatchRoute)],
  declarations: [SurveyBatchComponent, SurveyBatchDetailComponent, SurveyBatchUpdateComponent],
  entryComponents: [SurveyBatchComponent, SurveyBatchUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSurveyBatchModule {}
