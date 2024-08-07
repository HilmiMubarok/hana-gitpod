import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovenantComponent } from './covenant.component';
import { CreditProposalTabCovenantComponent } from './credit-proposal-tab-covenant.component';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalDocumentChecklistComponent } from '../document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogComponent } from '../document-checklist/document-checklist-dialog.component';
import { DeviationComponent } from './deviation.component';
import { CreditProposalOtherCovenantComponent } from './other-covenant/credit-proposal-other-covenant.component';
import { CreditProposalOtherDeviationComponent } from './other-covenant/credit-proposal-other-deviation.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [
    CovenantComponent,
    CreditProposalTabCovenantComponent,
    CreditProposalDocumentChecklistComponent,
    DocumentChecklistDialogComponent,
    DeviationComponent,
    CreditProposalOtherCovenantComponent,
    CreditProposalOtherDeviationComponent,
  ],
  declarations: [
    CovenantComponent,
    CreditProposalTabCovenantComponent,
    CreditProposalDocumentChecklistComponent,
    DocumentChecklistDialogComponent,
    DeviationComponent,
    CreditProposalOtherCovenantComponent,
    CreditProposalOtherDeviationComponent,
  ],
})
export class CovenantModule {}
