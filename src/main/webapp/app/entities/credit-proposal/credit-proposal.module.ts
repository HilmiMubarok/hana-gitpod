import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalComponent } from './credit-proposal.component';
import { CreditProposalDetailComponent } from './credit-proposal-detail.component';
import { CreditProposalUpdateComponent } from './credit-proposal-update.component';
import { creditProposalRoute } from './credit-proposal.route';
import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(creditProposalRoute)],
  declarations: [
    CreditProposalComponent,
    CreditProposalDetailComponent,
    CreditProposalUpdateComponent,
    CreditProposalUpdateCustomComponent,
  ],
  entryComponents: [CreditProposalComponent, CreditProposalUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
