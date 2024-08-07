import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PositionTypeComponent } from './position-type.component';
import { PositionTypeDetailComponent } from './position-type-detail.component';
import { PositionTypeUpdateComponent } from './position-type-update.component';
import { positionTypeRoute } from './position-type.route';
import { PositionTypeViewComponent } from './position-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(positionTypeRoute)],
  declarations: [PositionTypeComponent, PositionTypeDetailComponent, PositionTypeUpdateComponent, PositionTypeViewComponent],
  entryComponents: [PositionTypeComponent, PositionTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPositionTypeModule {}
