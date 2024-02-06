import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DppkFinalizeComponent } from './dppk-finalize.component';
import { DppkFinalizeReviewResolve, DppkFinalizeReviewRoute } from './dppk-finalize.route';
import { DppkFinalizeDetailComponent } from './dppk-finalize-detail.component';
// import { DppkPreparationComponent } from './dppk-preparation/dppk-preparation.component';
// import { BankAccountComponent } from './dppk-preparation/bank-account/bank-account.component';
// import { BankAccountDialogComponent } from './dppk-preparation/bank-account/bank-account-dialog.component';
// import { GenerateDraftDppkComponent } from './dppk-preparation/generate-draft-dppk/generate-draft-dppk.component';
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
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(DppkFinalizeReviewRoute)],
  declarations: [
    DppkFinalizeComponent,
    DppkFinalizeDetailComponent,
    // DppkPreparationComponent,
    // BankAccountComponent,
    // BankAccountDialogComponent,
    // GenerateDraftDppkComponent,

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
  entryComponents: [DppkFinalizeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIDppkFinalizeModule {}
