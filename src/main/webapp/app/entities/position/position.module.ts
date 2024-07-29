import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { PositionComponent } from './position.component';
import { PositionDetailComponent } from './position-detail.component';
import { PositionUpdateComponent } from './position-update.component';
import { positionRoute } from './position.route';
import { PositionViewComponent } from './position-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(positionRoute)],
  declarations: [PositionComponent, PositionDetailComponent, PositionUpdateComponent, PositionViewComponent],
  entryComponents: [PositionComponent, PositionUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPositionModule {}
