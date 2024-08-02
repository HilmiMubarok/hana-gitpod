import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { creditProposalRoute } from './dpdl-finalize.route';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { DpdlFinalizeComponent } from './dpdl-finalize.component';
import { DpdlFinalizeViewComponent } from './dpdl-finalize-view.component';
import { ApprovalSheetInternalMemoComponent } from './approval-sheet-internal-memo/approval-sheet-internal-memo.component';
import { ApprovalSheetInternalMemoDialogComponent } from './approval-sheet-internal-memo/dialog-approval-sheet/approval-sheet-internal-memo-dialog.component';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { CollateralInfoCpModule } from '../credit-proposal/collateral-info/collateral-info-cp.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    SharedEntityModule,
    LoanFacilityModule,
    ExposureModule,
    MemoBandingModule,
    CollateralInfoCpModule,
    CreditProposalSummaryTabModule,
    RouterModule.forChild(creditProposalRoute),
  ],
  declarations: [
    DpdlFinalizeComponent,
    DpdlFinalizeViewComponent,
    ApprovalSheetInternalMemoComponent,
    ApprovalSheetInternalMemoDialogComponent,
  ],
  entryComponents: [DpdlFinalizeComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DpdlFinalizeModule {}
