import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PositionReportingStructureComponent } from './position-reporting-structure.component';
import { PositionReportingStructureDetailComponent } from './position-reporting-structure-detail.component';
import { PositionReportingStructureUpdateComponent } from './position-reporting-structure-update.component';
import { positionReportingStructureRoute } from './position-reporting-structure.route';
import { PositionReportingStructureDialogComponent } from './position-reporting-structure-dialog.component';
import { PositionReportingStructureUploadComponent } from './position-reporting-structure-upload.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(positionReportingStructureRoute)],
  declarations: [
    PositionReportingStructureComponent,
    PositionReportingStructureDetailComponent,
    PositionReportingStructureUpdateComponent,
    PositionReportingStructureDialogComponent,
    PositionReportingStructureUploadComponent,
  ],
  entryComponents: [PositionReportingStructureComponent, PositionReportingStructureUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPositionReportingStructureModule {}
