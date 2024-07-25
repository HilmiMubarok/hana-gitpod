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
import { CollateralAppraisalNewComponent } from './collateral-appraisal-new.component';
import { CollateralAppraisalDataNasabahComponent } from './addSelect/collateral-appraisal-data-nasabah.component';
import { CollateralAppraisalListComponent } from './addSelect/collateral-appraisal-list.component';
import { CollateralAppraisalMainComponent } from './collateral-appraisal-main.component';
import { CollateralAppraisalDetailProcessRealEstateComponent } from './collateral/collateral-appraisal-process-detail-real-estate.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from './collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralVehicleDialogComponent } from './collateral/dialogs/collateral-vehicle-dialog.component';
import { CollateralLandDialogComponent } from './collateral/dialogs/collateral-land-dialog.component';
import { CollateralMachineDialogComponent } from './collateral/dialogs/collateral-machine-dialog.component';
import { CollateralAppraisalValuationMachineDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-machine-dialog.component';
import { CollateralAppraisalPartyGroupViewComponent } from './collateral-appraisal-party-group-view.component';
import { CollateralAppraisalValuationPropertyComponent } from './valuation/details/collateral-appraisal-valuation-property.component';
import { CollateralAppraisalValuationPropertyDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-property-dialog.component';
import { CollateralAppraisalValuationLandDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-land-dialog.component';
import { CollateralAppraisalValuationVehicleComponent } from './valuation/details/collateral-appraisal-valuation-vehicle.component';
import { CollateralAppraisalValuationVehicleDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-vehicle-dialog.component';
import { CollateralAppraisalMaterialComponent } from './collateral-appraisal-material.component';
import { CollateralAppraisalDetailProcessLandCertificatesComponent } from './collateral/collateral-appraisal-process-detail-land-certificates.component';
import { CollateralAppraisalDetailProcessLandComponent } from './collateral/collateral-appraisal-process-detail-land.component';
import { DialogCollateralAppraisalCifComponent } from './addSelect/dialog-collateral-appraisal-cif.component';
import { CollateralAppraisalValuationMachineComponent } from './valuation/details/collateral-appraisal-valuation-machine.component';
import { CollateralAppraisalNewInfoComponent } from './addSelect/collateral-appraisal-info.component';
import { TypeDialogAppraisalComponent } from './addSelect/type-dialog-appraisal.component';
import { CollateralAppraisalForwardToComponent } from './summary/forward-to/collateral-appraisal-forward-to.component';
import { GroupCollateralListAppraisalComponent } from './groupList/group-collateral-list-appraisal.component';
import { GroupCollateralAppraisalComponent } from './groupList/group-collateral-appraisal.component';
import { CollateralAppraisalViewComponent } from './collateral-appraisal-view.component';
@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(CollateralAppraisalRoute)],
  declarations: [
    CollateralAppraisalMaterialComponent,
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalNewComponent,
    CollateralAppraisalDataNasabahComponent,
    CollateralAppraisalListComponent,
    CollateralAppraisalMainComponent,
    // CollateralAppraisalPersonViewComponent,
    CollateralBuildingDetailDialogComponent,
    CollateralBuildingFloorDialogComponent,
    CollateralLandDialogComponent,
    CollateralVehicleDialogComponent,
    CollateralAppraisalValuationVehicleDialogComponent,
    CollateralAppraisalMainComponent,
    CollateralMachineDialogComponent,
    CollateralAppraisalValuationMachineDialogComponent,
    // CollateralAppraisalPartyGroupViewComponent,
    CollateralAppraisalValuationPropertyDialogComponent,
    DialogCollateralAppraisalCifComponent,
    CollateralAppraisalNewInfoComponent,
    TypeDialogAppraisalComponent,
    CollateralAppraisalForwardToComponent,
    GroupCollateralListAppraisalComponent,
    GroupCollateralAppraisalComponent,
    CollateralAppraisalViewComponent,
  ],
  entryComponents: [
    CollateralAppraisalComponent,
    CollateralAppraisalUpdateComponent,

    // CollateralAppraisalPartyGroupViewComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
