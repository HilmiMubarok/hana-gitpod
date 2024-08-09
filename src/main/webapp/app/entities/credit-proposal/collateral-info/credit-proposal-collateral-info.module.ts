import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { CreditProposalCollateralInfoComponent } from './credit-proposal-collateral-info.component';
import { CreditProposalCollateralInfoRemarksModule } from './remarks/credit-proposal-collateral-info-remarks.module';

@NgModule({
  imports: [SharedModule, SharedEntityModule, CreditProposalCollateralInfoRemarksModule],
  declarations: [CreditProposalCollateralInfoComponent],
  exports: [CreditProposalCollateralInfoComponent],
})
export class CreditProposalCollateralInfoModule {}
