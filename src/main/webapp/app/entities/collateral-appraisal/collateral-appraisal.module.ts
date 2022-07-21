import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CollateralAppraisalComponent } from './collateral-appraisal.component';
import { CollateralAppraisalDetailComponent } from './collateral-appraisal-detail.component';
import { CollateralAppraisalUpdateComponent } from './collateral-appraisal-update.component';
import {SharedLibsModule} from 'app/shared/shared-libs.module';
import { collateralAppraisalRoute } from './collateral-appraisal.route';
import { CollateralAppraisalSummaryReturnComponent } from './collateral-appraisal-summary-return.component';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { CollateralAppraisalJaminanComponent } from './collateral-appraisal-jaminan.component';
import { CollateralAppraisalListComponent } from './collateral-appraisal-list.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(collateralAppraisalRoute)],
  declarations: [CollateralAppraisalComponent, CollateralAppraisalDetailComponent, CollateralAppraisalUpdateComponent, CollateralAppraisalSummaryReturnComponent],
  entryComponents: [CollateralAppraisalComponent, CollateralAppraisalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})
export class LosgwCollateralAppraisalModule {}
