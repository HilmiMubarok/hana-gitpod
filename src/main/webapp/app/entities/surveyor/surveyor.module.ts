import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyorComponent } from './surveyor.component';
import { SurveyorDetailComponent } from './surveyor-detail.component';
import { SurveyorUpdateComponent } from './surveyor-update.component';
import { surveyorRoute } from './surveyor.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(surveyorRoute)],
  declarations: [SurveyorComponent, SurveyorDetailComponent, SurveyorUpdateComponent],
  entryComponents: [SurveyorComponent, SurveyorUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwSurveyorModule {}
