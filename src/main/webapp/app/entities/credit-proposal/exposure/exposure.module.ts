import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { TotalExposureComponent } from './total-exposure/total-exposure.component';
import { IndustryLimitComponent } from './industry-limit/industry-limit.component';
import { LegalLendingComponent } from './legal-lending/legal-lending.component';
import { CreditProposalTabExposureComponent } from './credit-proposal-tab-exposure.component';

@NgModule({
  declarations: [CreditProposalTabExposureComponent, TotalExposureComponent, IndustryLimitComponent, LegalLendingComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreditProposalTabExposureComponent, TotalExposureComponent, IndustryLimitComponent, LegalLendingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExposureModule {}
