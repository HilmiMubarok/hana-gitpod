import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralParameterComponent } from './collateral-parameter.component';
import { CollateralParameterDialogComponent } from './collateral-parameter-dialog.component';
import { collateralParameterRoute } from './collateral-parameter.route';
import { CollateralProposePricingDialogEditComponent } from './collateral-propose-pricing/collateral-propose-pricing-dialog-edit.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(collateralParameterRoute)],
  declarations: [CollateralParameterComponent, CollateralParameterDialogComponent, CollateralProposePricingDialogEditComponent],
  entryComponents: [CollateralParameterDialogComponent, CollateralProposePricingDialogEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralParameterModule {}
