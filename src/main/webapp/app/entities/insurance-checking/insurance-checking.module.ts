import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { InsuranceCheckingComponent } from './insurance-checking.component';
import { InsuranceCheckingRoute } from './insurance-checking.route';
import { InsuranceCheckingDetailComponent } from './insurance-checking-detail.component'; // import { PartyCifCustomerInfoComponent } from './customer-info/party-cif-customer-info.component';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    LoanFacilityModule,
    ExposureModule,
    InsuranceInformationModule,
    RouterModule.forChild(InsuranceCheckingRoute),
  ],
  declarations: [InsuranceCheckingComponent, InsuranceCheckingDetailComponent],
  entryComponents: [InsuranceCheckingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwInsuranceCheckingModule {}
