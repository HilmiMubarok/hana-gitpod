import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { collateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalDataNasabahComponent } from './collateral-appraisal-data-nasabah.component';
import { CollateralAppraisalUpdateNewComponent } from './collateral-appraisal-update-new.component';
import { CollateralAppraisalListComponent } from './collateral-appraisal-list.component';
import { CollateralAppraisalJaminanComponent } from './collateral-appraisal-jaminan.component';

import { GridModule, PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(collateralAppraisalRoute)],
  declarations: [
    CollateralAppraisalJaminanComponent,
    CollateralAppraisalListComponent,
    CollateralAppraisalUpdateNewComponent,
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalDataNasabahComponent,
  ],
  entryComponents: [
    CollateralAppraisalListComponent,
    CollateralAppraisalComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalDataNasabahComponent,
    CollateralAppraisalUpdateNewComponent,
  ],
  providers: [PageService, ToolbarService, EditService],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
