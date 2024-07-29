import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

import { OfferingLetterRoute } from './history-poposal.route';
import { HistoryProposalComponent } from './history-poposal.component';
import { CovenantModule } from 'app/entities/credit-proposal/convenant/covenant.module';
import { RiskAcceptanceCriteriaModule } from 'app/entities/credit-proposal/risk-criteria/risk-acceptance-criteria.module';
import { LoanFacilityModule } from 'app/entities/credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from 'app/entities/credit-proposal/exposure/exposure.module';
import { ManagementInfoModule } from 'app/entities/credit-proposal/management-info/management-info.module';
import { BusinessActivityModule } from 'app/entities/credit-proposal/busines-activity/business-activity.module';
import { SlikMainModule } from 'app/entities/loan-analys/slik/slik-main.module';
import { ProposePricingModule } from 'app/entities/credit-proposal/propose-pricing/propose-pricing.module';
import { MemoBandingModule } from 'app/entities/credit-proposal/memo-banding/memo-banding.module';
import { TradeCheckingModule } from 'app/entities/credit-proposal/trade-checking/trade-checking.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    CovenantModule,
    RiskAcceptanceCriteriaModule,
    LoanFacilityModule,
    ExposureModule,
    ManagementInfoModule,
    BusinessActivityModule,
    SlikMainModule,
    ProposePricingModule,
    MemoBandingModule,
    TradeCheckingModule,
    RouterModule.forChild(OfferingLetterRoute),
  ],
  declarations: [HistoryProposalComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwHistoryProposalModule {}
