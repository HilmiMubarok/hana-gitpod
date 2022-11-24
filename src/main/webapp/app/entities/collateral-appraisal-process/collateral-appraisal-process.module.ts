import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { CollateralAppraisalProcessMaterialComponent } from './collateral-appraisal-process-material.component';
import { CollateralAppraisalProcessRoute } from './collateral-appraisal-process.route';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(CollateralAppraisalProcessRoute)],
  declarations: [CollateralAppraisalProcessMaterialComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalProcessModule {}
