import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';

import { OfferingLetterRoute } from './dar-checker-confirmation.route';
import { DarCheckerConfirmationComponent } from './dar-checker-confirmation.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(OfferingLetterRoute)],
  declarations: [DarCheckerConfirmationComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwConfirmationDecisionApprovalReportModule {}
