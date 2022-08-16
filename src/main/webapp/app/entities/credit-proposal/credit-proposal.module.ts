import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { creditProposalRoute } from './credit-proposal.route';
import { CreditProposalUpdateCustomComponent } from './credit-proposal-update-custom.component';
import { CreditProposalComponent } from './credit-proposal.component';

import { ProposalBasicInformationComponent } from './proposal-basic-information.component';
import { CreditProposalTabBusinessActivityComponent } from './credit-proposal-tab-business-activity.component';

import { CreditProposalListComponent } from './credit-proposal-list-component';

import { CreditProposalRiskAcceptanceCriteriaComponent } from './credit-proposal-risk-acceptance-criteria-component';
import { PageService, ToolbarService, EditService } from '@syncfusion/ej2-angular-grids';
import { SharedLibsModule } from 'app/shared/shared-libs.module';

import { CreditProposalAnchorComponent } from './credit-proposal-anchor.component';

import { CreditProposaTabManagementInfoComponent } from './credit-proposal-tab-management-info.component';
import { CreditProposalTabExposureComponent } from './credit-proposal-tab-exposure.component';

import { CreditProposalApprovalListComponent } from './credit-proposal-approval-list.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, SharedLibsModule, RouterModule.forChild(creditProposalRoute)],

  declarations: [
    CreditProposalComponent,
    CreditProposalUpdateCustomComponent,
    CreditProposalAnchorComponent,

    ProposalBasicInformationComponent,
    CreditProposaTabManagementInfoComponent,
    CreditProposalRiskAcceptanceCriteriaComponent,
    CreditProposalListComponent,
    CreditProposalTabBusinessActivityComponent,
    CreditProposalTabExposureComponent,
    CreditProposalApprovalListComponent,
  ],

  entryComponents: [],
  providers: [PageService, ToolbarService, EditService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditProposalModule {}
