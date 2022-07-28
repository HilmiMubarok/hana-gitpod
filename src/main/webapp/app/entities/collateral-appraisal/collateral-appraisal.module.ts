import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { CollateralAppraisalDetailProcessMesinComponent } from './collateral-appraisal-process-detail-mesin.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from './collateral-appraisal-process-detail-unit-condition.component';
import { PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-angular-grids';
import { CollateralAppraisalDetailProcessBuildingConditionComponent } from './collateral-appraisal-process-detail-building-condition.component';
import { CollateralAppraisalDetailProcessLandConditionComponent } from './collateral-appraisal-process-detail-land-condition.component';
// import { CollateralAppraisalJaminanComponent } from './collateral-appraisal-jaminan.component';
// import { CollateralAppraisalListComponent } from './collateral-appraisal-list.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(CollateralAppraisalRoute)],
  providers: [PageService, SortService, FilterService, GroupService],
  declarations: [
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalDetailProcessMesinComponent,
    CollateralAppraisalDetailProcessBuildingConditionComponent,
    CollateralAppraisalDetailProcessLandConditionComponent,
  ],
  entryComponents: [CollateralAppraisalComponent, CollateralAppraisalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCollateralAppraisalModule {}
