import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOpsCheckingRoute } from './loan-ops-checking.router';
import { LoanOpsCheckingDetailComponent } from './loan-ops-checking-detail.component';
import { LoanOpsCheckingComponent } from './loan-ops-checking.component';
@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(LoanOpsCheckingRoute)],
  declarations: [LoanOpsCheckingComponent, LoanOpsCheckingDetailComponent],
  entryComponents: [LoanOpsCheckingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOpsCheckingModule {}
