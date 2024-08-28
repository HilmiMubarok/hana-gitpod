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
import { CreditProposalTabSummaryModule } from '../credit-proposal/credit-proposal-tab-summary.module';
import { CompareDataModule } from '../compare-data/compare-data.module';
import { CreditProposalTabLoanFacilityDetailModule } from '../credit-proposal/loan-facility/credit-proposal-tab-loan-facility-detail.module';
import { CreditProposalMemoBandingModule } from '../credit-proposal/memo-banding/credit-proposal-memo-banding.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';
import { LoanAnalysOpinionCompliancePartModule } from '../loan-analys/opinion/loan-analys-opinion-compliance-part.module';

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    SharedEntityModule,
    CreditProposalTabSummaryModule,
    CompareDataModule,
    CreditProposalTabLoanFacilityDetailModule,
    CreditProposalMemoBandingModule,
    LoanAnalysComplianceModule,
    LoanAnalysOpinionCompliancePartModule,
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
