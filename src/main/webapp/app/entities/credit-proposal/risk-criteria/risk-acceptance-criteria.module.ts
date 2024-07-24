import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalRiskAcceptanceCriteriaComponent } from './credit-proposal-risk-acceptance-criteria-component';
import { CreditProposalRacNilaiPembelianComponent } from './nilai-pembelian/credit-proposal-risk-acceptance-criteria-nilai-pembelian';
import { CreditProposalRiskAcceptanceCriteriaBelowComponent } from './below/credit-proposal-risk-acceptance-criteria-below-component';
import { CreditProposalAceptanceCriteriaBackToBackComponent } from './back-to-back/credit-proposal-risk-acceptance-criteria-back-to-back-component';

@NgModule({
  declarations: [
    CreditProposalRiskAcceptanceCriteriaComponent,
    CreditProposalRacNilaiPembelianComponent,
    CreditProposalRiskAcceptanceCriteriaBelowComponent,
    CreditProposalAceptanceCriteriaBackToBackComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    CreditProposalRiskAcceptanceCriteriaComponent,
    CreditProposalRacNilaiPembelianComponent,
    CreditProposalRiskAcceptanceCriteriaBelowComponent,
    CreditProposalAceptanceCriteriaBackToBackComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RiskAcceptanceCriteriaModule {}
