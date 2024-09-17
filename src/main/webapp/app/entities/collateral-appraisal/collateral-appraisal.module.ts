import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { CollateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { CollateralBuildingFloorDialogComponent } from './collateral/dialogs/collateral-building-floor-dialog.component';
import { CollateralBuildingDetailDialogComponent } from './collateral/dialogs/collateral-building-detail-dialog.component';
import { CollateralAppraisalNewComponent } from './collateral-appraisal-new.component';
import { CollateralAppraisalDataNasabahComponent } from './addSelect/collateral-appraisal-data-nasabah.component';
import { CollateralAppraisalListComponent } from './addSelect/collateral-appraisal-list.component';
import { CollateralAppraisalMainComponent } from './collateral-appraisal-main.component';
import { CollateralVehicleDialogComponent } from './collateral/dialogs/collateral-vehicle-dialog.component';
import { CollateralLandDialogComponent } from './collateral/dialogs/collateral-land-dialog.component';
import { CollateralMachineDialogComponent } from './collateral/dialogs/collateral-machine-dialog.component';
import { CollateralAppraisalValuationMachineDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-machine-dialog.component';
import { CollateralAppraisalValuationPropertyDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-property-dialog.component';
import { CollateralAppraisalValuationVehicleDialogComponent } from './valuation/dialogs/collateral-appraisal-valuation-vehicle-dialog.component';
import { CollateralAppraisalMaterialComponent } from './collateral-appraisal-material.component';
import { DialogCollateralAppraisalCifComponent } from './addSelect/dialog-collateral-appraisal-cif.component';
import { CollateralAppraisalSummaryModule } from './summary/collateral-appraisal-summary.module';
@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    SharedEntityModule,
    CollateralAppraisalSummaryModule,
    RouterModule.forChild(CollateralAppraisalRoute),
  ],
  declarations: [
    CollateralAppraisalMaterialComponent,
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalNewComponent,
    CollateralAppraisalDataNasabahComponent,
    CollateralAppraisalListComponent,
    CollateralAppraisalMainComponent,

    CollateralBuildingDetailDialogComponent,
    CollateralBuildingFloorDialogComponent,
    CollateralLandDialogComponent,
    CollateralVehicleDialogComponent,
    CollateralAppraisalValuationVehicleDialogComponent,

    CollateralMachineDialogComponent,
    CollateralAppraisalValuationMachineDialogComponent,

    CollateralAppraisalValuationPropertyDialogComponent,
    DialogCollateralAppraisalCifComponent,
  ],
  entryComponents: [CollateralAppraisalComponent, CollateralAppraisalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
