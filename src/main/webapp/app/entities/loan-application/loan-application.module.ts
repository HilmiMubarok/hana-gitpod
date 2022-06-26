import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanApplicationComponent } from './loan-application.component';
import { LoanApplicationDetailComponent } from './loan-application-detail.component';
import { LoanApplicationUpdateComponent } from './loan-application-update.component';
import { loanApplicationRoute } from './loan-application.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(loanApplicationRoute)],
  declarations: [LoanApplicationComponent, LoanApplicationDetailComponent, LoanApplicationUpdateComponent],
  entryComponents: [LoanApplicationComponent, LoanApplicationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanApplicationModule {}
