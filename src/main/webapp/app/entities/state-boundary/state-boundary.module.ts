import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { StateBoundaryComponent } from './state-boundary.component';
import { StateBoundaryDetailComponent } from './state-boundary-detail.component';
import { StateBoundaryUpdateComponent } from './state-boundary-update.component';
import { stateBoundaryRoute } from './state-boundary.route';
import { StateBoundaryViewComponent } from './state-boundary-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(stateBoundaryRoute)],
  declarations: [StateBoundaryComponent, StateBoundaryDetailComponent, StateBoundaryUpdateComponent, StateBoundaryViewComponent],
  entryComponents: [StateBoundaryComponent, StateBoundaryUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwStateBoundaryModule {}
