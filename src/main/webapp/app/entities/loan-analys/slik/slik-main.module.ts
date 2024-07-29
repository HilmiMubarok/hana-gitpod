import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SlikSummaryDebiturComponent } from 'app/entities/credit-proposal/slik-summary/debitur/slik-summary-debitur.component';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAnalysSlikMainComponent } from './loan-analys-slik-main.component';

@NgModule({
  imports: [SharedModule],
  declarations: [SlikSummaryDebiturComponent, LoanAnalysSlikMainComponent],
  exports: [SlikSummaryDebiturComponent, LoanAnalysSlikMainComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SlikMainModule {}
