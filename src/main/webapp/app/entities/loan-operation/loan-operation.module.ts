import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { LoanOperationComponent } from './loan-operation.component';
import { SharedModule } from 'app/shared/shared.module';
import { SharedEntityModule } from '../shared-entity.module';
import { RouterModule } from '@angular/router';
import { LoanOperationRoute } from './loan-operation.router';
import { LoanOperationDetailComponent } from './loan-operation-detail.component';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    ExposureModule,
    MemoBandingModule,
    InsuranceInformationModule,
    RouterModule.forChild(LoanOperationRoute),
  ],
  declarations: [LoanOperationComponent, LoanOperationDetailComponent],
  entryComponents: [LoanOperationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanOperationModule {}
