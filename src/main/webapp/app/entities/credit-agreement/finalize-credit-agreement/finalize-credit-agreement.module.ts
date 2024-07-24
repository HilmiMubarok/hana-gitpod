import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewHistoryComponent } from './review-history/review-history.component';
import { GeneratePKDraftComponent } from './generate-pk-draft/generate-pk-draft.component';
import { SharedModule } from 'app/shared/shared.module';
import { FinalizeCreditAgreementComponent } from './finalize-credit-agreement.component';
import { ReviewHistoryDialogComponent } from '../review-history-dialog/review-history-dialog.component';

@NgModule({
  declarations: [ReviewHistoryComponent, ReviewHistoryDialogComponent, GeneratePKDraftComponent, FinalizeCreditAgreementComponent],
  imports: [CommonModule, SharedModule],
  exports: [ReviewHistoryComponent, ReviewHistoryDialogComponent, GeneratePKDraftComponent, FinalizeCreditAgreementComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FinalizeCreditAgreementModule {}
