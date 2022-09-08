import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { creditProposalRoute } from './credit-proposal.route';
import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';

import { CreditProposalAnchorComponent } from './credit-proposal-anchor.component';
import { CreditProposalListComponent } from './credit-proposal-list.component';
import { CreditProposalFinancialStatementComponent } from './financial-statement/credit-proposal-financial-statement.component';
import { ProposalBasicInformationComponent } from './proposal-basic-information.component';
import { CreditProposalBankAccountAnalystComponent } from './bank-account-analyst/bank-account-analyst.component';
import { CreditProposalBankAccountAnalystDialogComponent } from './bank-account-analyst/bank-account-analyst-dialog.component';
import { CreditProposalCorrespondenceComponent } from './correspondence/credit-proposal-correspondence.component';
import { CorrespondenceDialogComponent } from './correspondence/correspondence-dialog.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(creditProposalRoute)],
  declarations: [
    CreditProposalComponent,
    CreditProposalUpdateCustomComponent,
    CreditProposalAnchorComponent,
    CreditProposalListComponent,
    CreditProposalFinancialStatementComponent,
    CreditProposalBankAccountAnalystComponent,
    ProposalBasicInformationComponent,
    CreditProposalBankAccountAnalystDialogComponent,
    CreditProposalCorrespondenceComponent,
    CorrespondenceDialogComponent,
  ],
  entryComponents: [CreditProposalBankAccountAnalystDialogComponent, CorrespondenceDialogComponent],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
