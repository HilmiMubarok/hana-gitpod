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
import { CollateralMachineDialogComponent } from './collateral/dialogs/collateral-machine-dialog.component';
import { CollateralAppraisalValuationComponent } from './valuation/collateral-appraisal-valuation.component';
import { CollateralAppraisalValuationMachineComponent } from './valuation/details/collateral-appraisal-valuation-machine.component';
import { CollateralAppraisalValuationMachineDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-machine-dialog.component';
import { CollateralAppraisalPartyGroupViewComponent } from './collateral-appraisal-party-group-view-component';
import { CollateralAppraisalValuationPropertyComponent } from './valuation/details/collateral-appraisal-valuation-property.component';
import { CollateralAppraisalValuationPropertyDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-property-dialog.component';
import { CollateralAppraisalValuationLandDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-land-dialog.component';
import { CollateralAppraisalValuationVehicleComponent } from './valuation/details/collateral-appraisal-valuation-vehicle.component';
import { CollateralAppraisalValuationVehicleDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-vehicle-dialog.component';

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
    CollateralAppraisalValuationVehicleDialogComponent,
    CollateralAppraisalMainComponent,
    CollateralInfoComponent,
    CollateralMachineDialogComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalValuationComponent,
    CollateralAppraisalValuationMachineComponent,
    CollateralAppraisalValuationMachineDialogComponent,
    CollateralAppraisalPartyGroupViewComponent,
    CollateralAppraisalValuationPropertyComponent,
    CollateralAppraisalValuationPropertyDialogComponent,
    CollateralAppraisalValuationLandDialogComponent,
    CollateralAppraisalValuationVehicleComponent,
  ],
  entryComponents: [
    CollateralAppraisalComponent,
    CollateralAppraisalUpdateComponent,
    CollateralInfoComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalValuationMachineComponent,
    CollateralAppraisalPartyGroupViewComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
