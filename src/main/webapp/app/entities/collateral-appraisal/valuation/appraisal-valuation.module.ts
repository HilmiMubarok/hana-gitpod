import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalValuationComponent } from './collateral-appraisal-valuation.component';
import { CollateralAppraisalValuationMachineComponent } from './details/collateral-appraisal-valuation-machine.component';
import { CollateralAppraisalValuationPropertyComponent } from './details/collateral-appraisal-valuation-property.component';
import { CollateralAppraisalValuationVehicleComponent } from './details/collateral-appraisal-valuation-vehicle.component';
import { CollateralAppraisalValuationLandDialogComponent } from './dialogs/collateral-appraisal-valuation-land-dialog.component';
import { CollateralAppraisalValuationVehicleDialogComponent } from './dialogs/collateral-appraisal-valuation-vehicle-dialog.component';
import { CollateralAppraisalValuationMachineDialogComponent } from './dialogs/collateral-appraisal-valuation-machine-dialog.component';
import { CollateralAppraisalValuationPropertyDialogComponent } from './dialogs/collateral-appraisal-valuation-property-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    CollateralAppraisalValuationComponent,
    CollateralAppraisalValuationMachineComponent,
    CollateralAppraisalValuationLandDialogComponent,
    CollateralAppraisalValuationVehicleComponent,
    CollateralAppraisalValuationPropertyComponent,
    CollateralAppraisalValuationMachineDialogComponent,
    CollateralAppraisalValuationVehicleDialogComponent,
    CollateralAppraisalValuationPropertyDialogComponent,
  ],
  exports: [
    CollateralAppraisalValuationComponent,
    CollateralAppraisalValuationMachineComponent,
    CollateralAppraisalValuationLandDialogComponent,
    CollateralAppraisalValuationVehicleComponent,
    CollateralAppraisalValuationPropertyComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppraisalValuationModule {}
