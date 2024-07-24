import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditAgreementReviewComponent } from './credit-agreement-review.component';
import { CreditAgreementReviewDetailComponent } from './credit-agreement-review-detail.component';
import { creditAgrementReviewRoute } from './credit-agreement-review.route';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
// import { PartyCifCustomerInfoComponent } from './customer-info/party-cif-customer-info.component';
// import { PartyCifCustomerInfoDebtorDataComponent } from './customer-info/party-cif-customer-info-debtor-data.component';
// import { PartyCifDocumentChecklistComponent } from './document-checklist/party-cif-document.checklist.component';
// import { PartyCifCustomerInfoRMInfoComponent } from './customer-info/party-cif-customer-info-rm-info.component';
// import { PartyCifManagementDataComponent } from './management-data/management-data-list.component';
// import { PartyCifCollateralInfoComponent } from './collateral-info/collateral-info.component';
// import { PartyCifCollateralInfoDialogComponent } from './collateral-info/collateral-info-dialog.component';
// import { PartyCifBusinessGroupComponent } from './business-group/party-cif-business-group.component';
// import { PartyCifOrganizationLegalComponent } from './organization-legal/party-cif-organization-legal.component';
// import { DebtorDataCreditRatingViewComponent } from '../debtor-data/credit-rating/debtor-data-credit-rating.component';
// import { PartyCifFinancialInfoComponent } from './financial-info/party-cif-financial-info.component';
// import { PartyCifRetriveInfoComponent } from './retrive-info/party-cif-retrive-info.component';
// import { FacilityInfoDebiturComponent } from '../debtor-data/facility-info/facility-info-debitur.component';
// import { FacilityInfoCifComponent } from './facility-info-cif/facility-info-cif.component';
// import { PartyCifDecisionApprovalReportComponent } from './decision-approval-report/party-cif-decision-approval-report.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, FinalizeCreditAgreementModule, RouterModule.forChild(creditAgrementReviewRoute)],
  declarations: [
    CreditAgreementReviewComponent,
    CreditAgreementReviewDetailComponent,

    // PartyCifUpdateComponent,
    // PartyCifCustomerInfoComponent,
    // PartyCifCustomerInfoDebtorDataComponent,
    // PartyCifDocumentChecklistComponent,
    // PartyCifCustomerInfoRMInfoComponent,
    // PartyCifManagementDataComponent,
    // PartyCifCollateralInfoComponent,
    // PartyCifCollateralInfoDialogComponent,
    // PartyCifBusinessGroupComponent,
    // PartyCifOrganizationLegalComponent,
    // DebtorDataCreditRatingViewComponent,
    // PartyCifFinancialInfoComponent,
    // PartyCifRetriveInfoComponent,
    // FacilityInfoDebiturComponent,
    // FacilityInfoCifComponent,
    // PartyCifDecisionApprovalReportComponent,
  ],
  entryComponents: [CreditAgreementReviewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditAgreementReviewModule {}
