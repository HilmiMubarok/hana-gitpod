import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { CreditProposalCollateralInfoRemarksModule } from '../collateral-info/remarks/credit-proposal-collateral-info-remarks.module';
import { CollateralInfoHistoryComponent } from './collateral-info-history.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, CreditProposalCollateralInfoRemarksModule],
  declarations: [CollateralInfoHistoryComponent],
  exports: [CollateralInfoHistoryComponent],
})
export class CollateralInfoHistoryModule {}
