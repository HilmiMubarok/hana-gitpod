import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { CollateralAppraisalComparisonDataComponent } from './collateral-appraisal-comparison-data.component';
import { collateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalValuationComponent } from './collateral-appraisal-valuation.component';
import { CollateralAppraisalDataNasabahComponent } from './collateral-appraisal-data-nasabah.component';
import { CollateralAppraisalUpdateNewComponent } from './collateral-appraisal-update-new.component';
import { CollateralAppraisalListComponent } from './collateral-appraisal-list.component';
import { CollateralAppraisalJaminanComponent } from './collateral-appraisal-jaminan.component';

import { GridModule, PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { CollateralAppraisalNegativeCollateralComponent } from './collateral-appraisal-negative-collateral.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(collateralAppraisalRoute)],
  declarations: [
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalValuationComponent,
    CollateralAppraisalNegativeCollateralComponent,
    CollateralAppraisalComparisonDataComponent,
  ],
  entryComponents: [CollateralAppraisalComponent, CollateralAppraisalUpdateComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
