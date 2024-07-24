import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMComponent } from './loan-analys-m.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';
import { LoanAnalysRoute } from './loan-analys.route';

import { LoanAnalysSlikMainComponent } from './slik/loan-analys-slik-main.component';
import { LoanAnalysGroupGuarantorAnalysisComponent } from './guarantour/loan-analys-group-guarantor-analysis.component';
import { LoanAnalysSlikSummaryComponent } from './slik-summary/loan-analys-slik-summary.component';
import { LoanAnalysCreditRatingViewComponent } from './credit-rating/loan-analys-credit-rating-view.component';
import { LoanAnalysFacilityDetailGridDarNotifComponent } from './dar-notif/loan-facility/grid/loan-analys-facility-detail-grid-dar-notif.component';
import { LoanAnalysFacilityDetaliMainComponent } from './dar-notif/loan-facility/loan-analys-facility-detali-main.component';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreditProposalPersonalInfoAnalystComponent } from './personal-info.component';
import { LoanAnalysPreviousDarComponent } from './previous/previous-dar/loan-analys-previous-dar.component';
import { LoanAnalysPreviousProposalComponent } from './previous/previous-proposal/loan-analys-previous-proposal.component';
import { CovenantModule } from '../credit-proposal/convenant/covenant.module';
import { StandartConvenantComponent } from './dar-final/convenant/other-covenant/standart-convenant/standart-convenant.component';
import { RiskAcceptanceCriteriaModule } from '../credit-proposal/risk-criteria/risk-acceptance-criteria.module';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';

@NgModule({
  imports: [
    SharedModule,
    SharedLibsModule,
    SharedEntityModule,
    CovenantModule,
    RiskAcceptanceCriteriaModule,
    LoanFacilityModule,
    RouterModule.forChild(LoanAnalysRoute),
    MatSlideToggleModule,
  ],
  declarations: [
    LoanAnalysComponent,
    LoanAnalysMComponent,
    LoanAnalysMainComponent,
    CreditProposalPersonalInfoAnalystComponent,
    LoanAnalysBatchBulkAssignComponent,
    LoanAnalysSlikMainComponent,
    LoanAnalysGroupGuarantorAnalysisComponent,
    LoanAnalysSlikSummaryComponent,
    LoanAnalysCreditRatingViewComponent,
    LoanAnalysFacilityDetailGridDarNotifComponent,
    LoanAnalysFacilityDetaliMainComponent,
    LoanAnalysPreviousDarComponent,
    LoanAnalysPreviousProposalComponent,
    StandartConvenantComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanAnalysModule {}
