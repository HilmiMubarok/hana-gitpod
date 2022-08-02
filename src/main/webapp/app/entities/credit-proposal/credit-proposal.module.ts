import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { creditProposalRoute } from './credit-proposal.route';
import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
import { CreditProposalComponent } from './credit-proposal.component';

import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(creditProposalRoute)],
  declarations: [CreditProposalComponent, CreditProposalUpdateCustomComponent, CreditProposalApprovalListComponent],
  entryComponents: [],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
