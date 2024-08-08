import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanOpsReviewComponent } from './laon-operation-review.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOpsReviewRoute } from './laon-operation-review.router';
import { LoanOpsReviewDetailComponent } from './laon-operation-review-detail.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, SharedEntityModule, FormsModule, RouterModule.forChild(LoanOpsReviewRoute)],
  declarations: [LoanOpsReviewComponent, LoanOpsReviewDetailComponent],
  entryComponents: [LoanOpsReviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOpsReviewModule {}
