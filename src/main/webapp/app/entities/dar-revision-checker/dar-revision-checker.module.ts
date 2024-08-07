import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { darRevisionCheckerRoute } from './dar-revision-checker.route';
// import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
// import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { DarRevisionCheckerComponent } from './dar-revision-checker.component';
import { DarRevisionCheckerViewComponent } from './dar-revision-checker-view.component';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { CreditProposalSummaryTabModule } from '../credit-proposal/summary/credit-proposal-tab-summary.module';
import { LoanAnalysOpinionModule } from '../loan-analys/opinion/loan-analys-opinion.module';
import { LoanAnalysComplianceModule } from '../loan-analys/compliance/loan-analys-compliance.module';

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    ExposureModule,
    SharedEntityModule,
    MemoBandingModule,
    CreditProposalSummaryTabModule,
    LoanAnalysOpinionModule,
    LoanAnalysComplianceModule,
    RouterModule.forChild(darRevisionCheckerRoute),
  ],
  declarations: [DarRevisionCheckerComponent, DarRevisionCheckerViewComponent],
  entryComponents: [DarRevisionCheckerComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DarRevisionCheckerModule {}
