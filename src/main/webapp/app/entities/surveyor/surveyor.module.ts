import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyorComponent } from './surveyor.component';
import { SurveyorDetailComponent } from './surveyor-detail.component';
import { SurveyorUpdateComponent } from './surveyor-update.component';
import { surveyorRoute } from './surveyor.route';
import { SurveyorViewComponent } from './surveyor-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(surveyorRoute)],
  declarations: [SurveyorComponent, SurveyorDetailComponent, SurveyorUpdateComponent, SurveyorViewComponent],
  entryComponents: [SurveyorComponent, SurveyorUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSurveyorModule {}
