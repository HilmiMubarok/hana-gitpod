import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { CreditProposalCollateralInfoModule } from '../credit-proposal/collateral-info/credit-proposal-collateral-info.module';
import { CompareDataComponent } from './compare-data.component';
import { CollateralInfoHistoryModule } from '../credit-proposal/collateral-info-history/collateral-info-history.module';

@NgModule({
  imports: [SharedModule, SharedEntityModule, CollateralInfoHistoryModule, CreditProposalCollateralInfoModule],
  declarations: [CompareDataComponent],
  exports: [CompareDataComponent, CreditProposalCollateralInfoModule],
})
export class CompareDataModule {}
