import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { collateralAppraisalRoute } from './collateral-appraisal.route';
import { PageService, SortService, FilterService, GroupService, DetailRowService } from '@syncfusion/ej2-angular-grids';

// import { CollateralAppraisalJaminanComponent } from './collateral-appraisal-jaminan.component';
// import { CollateralAppraisalListComponent } from './collateral-appraisal-list.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(collateralAppraisalRoute)],
  declarations: [CollateralAppraisalComponent, CollateralAppraisalDetailComponent, CollateralAppraisalUpdateComponent],
  entryComponents: [CollateralAppraisalComponent, CollateralAppraisalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PageService, SortService, FilterService, DetailRowService, GroupService],
})
export class LosgwCollateralAppraisalModule {}
