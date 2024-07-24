import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

import { OfferingLetterRoute } from './history-poposal.route';
import { HistoryProposalComponent } from './history-poposal.component';
import { CovenantModule } from 'app/entities/credit-proposal/convenant/covenant.module';
import { RiskAcceptanceCriteriaModule } from 'app/entities/credit-proposal/risk-criteria/risk-acceptance-criteria.module';
import { LoanFacilityModule } from 'app/entities/credit-proposal/loan-facility/loan-facility.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    CovenantModule,
    RiskAcceptanceCriteriaModule,
    LoanFacilityModule,
    RouterModule.forChild(OfferingLetterRoute),
  ],
  declarations: [HistoryProposalComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwHistoryProposalModule {}
