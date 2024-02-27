import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanOperationComponent } from './loan-operation.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOperationRoute } from './loan-operation.router';
import { LoanOperationDetailComponent } from './loan-operation-detail.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(LoanOperationRoute)],
  declarations: [LoanOperationComponent, LoanOperationDetailComponent],
  entryComponents: [LoanOperationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOperationModule {}
