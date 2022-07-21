import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import { CollateralAppraisalComparisonDataComponent } from './collateral-appraisal-comparison-data.component';
import { CollateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalValuationComponent } from './collateral-appraisal-valuation.component';
import { CollateralAppraisalDataNasabahComponent } from './collateral-appraisal-data-nasabah.component';
import { CollateralAppraisalUpdateNewComponent } from './collateral-appraisal-update-new.component';
import { CollateralAppraisalListComponent } from './collateral-appraisal-list.component';
import { CollateralAppraisalJaminanComponent } from './collateral-appraisal-jaminan.component';
import { CollateralAppraisalNegativeCollateralComponent } from './collateral-appraisal-negative-collateral.component';
import {
  GridModule,
  EditService,
  PageService,
  ToolbarService,
  SortService,
  FilterService,
  GroupService,
  DetailRowService,
} from '@syncfusion/ej2-angular-grids';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { CollateralAppraisalProcessComponent } from './collateral-appraisal-process.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(CollateralAppraisalRoute)],
  declarations: [
    CollateralAppraisalComponent,
    CollateralAppraisalDetailComponent,
    CollateralAppraisalUpdateComponent,
    CollateralAppraisalValuationComponent,
    CollateralAppraisalNegativeCollateralComponent,
    CollateralAppraisalComparisonDataComponent,
    CollateralAppraisalProcessComponent,
    CollateralAppraisalSummaryReturnComponent,
  ],
  entryComponents: [CollateralAppraisalComponent, CollateralAppraisalUpdateComponent],
  providers: [GridModule, EditService, PageService, ToolbarService, SortService, FilterService, DetailRowService, GroupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})
export class LosgwCollateralAppraisalModule {}
