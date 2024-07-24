import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { WorkTypeComponent } from './work-type.component';
import { WorkTypeDetailComponent } from './work-type-detail.component';
import { WorkTypeUpdateComponent } from './work-type-update.component';
import { workTypeRoute } from './work-type.route';
import { WorkTypeViewComponent } from './work-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(workTypeRoute)],
  declarations: [WorkTypeComponent, WorkTypeDetailComponent, WorkTypeUpdateComponent, WorkTypeViewComponent],
  entryComponents: [WorkTypeComponent, WorkTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwWorkTypeModule {}
