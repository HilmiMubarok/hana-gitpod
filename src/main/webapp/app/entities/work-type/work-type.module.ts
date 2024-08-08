import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { WorkTypeComponent } from './work-type.component';
import { WorkTypeDetailComponent } from './work-type-detail.component';
import { WorkTypeUpdateComponent } from './work-type-update.component';
import { workTypeRoute } from './work-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(workTypeRoute)],
  declarations: [WorkTypeComponent, WorkTypeDetailComponent, WorkTypeUpdateComponent],
  entryComponents: [WorkTypeComponent, WorkTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwWorkTypeModule {}
