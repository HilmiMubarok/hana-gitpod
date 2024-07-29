import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { insuranceInformationComponent } from './insurance-information.component';

@NgModule({
  imports: [SharedModule],
  declarations: [insuranceInformationComponent],
  exports: [insuranceInformationComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class InsuranceInformationModule {}
