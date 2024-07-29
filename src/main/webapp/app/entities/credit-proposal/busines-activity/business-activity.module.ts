import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalTabBusinessActivityComponent } from './credit-proposal-tab-business-activity.component';
import { ProjectAnalystRemarkComponent } from './project-analyst-remark.component';

@NgModule({
  declarations: [CreditProposalTabBusinessActivityComponent, ProjectAnalystRemarkComponent],
  imports: [CommonModule, SharedModule],
  exports: [CreditProposalTabBusinessActivityComponent, ProjectAnalystRemarkComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusinessActivityModule {}
