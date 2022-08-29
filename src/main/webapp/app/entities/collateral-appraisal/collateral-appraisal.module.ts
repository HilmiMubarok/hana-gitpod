import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { CollateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { CollateralAppraisalPersonViewComponent } from './collateral-appraisal-person-view.component';
import { CollateralBuildingFloorDialogComponent } from './collateral/dialogs/collateral-building-floor-dialog.component';
import { CollateralBuildingDetailDialogComponent } from './collateral/dialogs/collateral-building-detail-dialog.component';
import { CollateralAppraisalMainComponent } from './collateral-appraisal-main.component';
import { CollateralAppraisalDetailProcessRealEstateComponent } from './collateral/collateral-appraisal-process-detail-real-estate.component';
import { CollateralInfoComponent } from './collateral-info.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from './collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralVehicleDialogComponent } from './collateral/dialogs/collateral-vehicle-dialog.component';
import { CollateralLandDialogComponent } from './collateral/dialogs/collateral-land-dialog.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(CollateralAppraisalRoute)],
  declarations: [
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalMainComponent,
    CollateralAppraisalPersonViewComponent,
    CollateralBuildingDetailDialogComponent,
    CollateralBuildingFloorDialogComponent,
    CollateralLandDialogComponent,
    CollateralVehicleDialogComponent,
    CollateralAppraisalMainComponent,
    CollateralInfoComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
  ],
  entryComponents: [
    CollateralAppraisalComponent,
    CollateralAppraisalUpdateComponent,
    CollateralInfoComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
