import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

import { OfferingLetterRoute } from './history-poposal.route';
import { HistoryProposalComponent } from './history-poposal.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(OfferingLetterRoute)],
  declarations: [HistoryProposalComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwHistoryProposalModule {}
