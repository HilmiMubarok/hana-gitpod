import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DataViewModule } from 'primeng/dataview';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ListboxModule } from 'primeng/listbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PartyViewComponent } from './party/party-view.component';
import { PersonViewComponent } from './person/person-view.component';
import { PartyGroupViewComponent } from './party-group/party-group-view.component';
import { PartyTypeViewComponent } from './party-type/party-type-view.component';
import { ProductViewComponent } from './product/product-view.component';
import { FeatureViewComponent } from './feature/feature-view.component';
import { PostalAddressViewComponent } from './postal-address/postal-address-view.component';
// import { InternalViewComponent } from './internal/internal-view.component';
import { PartyPaymentPrefViewComponent } from './party-payment-pref/party-payment-pref-view.component';
import { CifViewComponent } from './cif/cif-view.component';
import { CollateralUpdateComponent } from './collateral/collateral-update.component';
import { CollateralViewComponent } from './collateral/collateral-view.component';
import { CreditRatingViewComponent } from './credit-rating/credit-rating-view.component';
import { EmploymentViewComponent } from './employment/employment-view.component';
import { CifViewCustomComponent } from './cif/cif-view-custom.component';
import { CollateralAppraisalInfoComponent } from './collateral-appraisal/info/collateral-appraisal-info.component';
import { CollateralAppraisalExternalOfficerComponent } from './collateral-appraisal/external/collateral-appraisal-external-officer.component';
import { CollateralAppraisalDetailProcessMesinComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-mesin.component';
import { CollateralAppraisalNegativeCollateralComponent } from './collateral-appraisal/negative/collateral-appraisal-negative-collateral.component';
import { CollateralAppraisalComparisonComponent } from './collateral-appraisal/comparison/collateral-appraisal-comparison.component';
import { CollateralAppraisalProcessComponent } from './collateral-appraisal/foto/collateral-appraisal-process.component';
import { CollateralAppraisalSummaryComponent } from './collateral-appraisal/summary/collateral-appraisal-summary.component';
import { PersonEmployeeViewComponent } from './person/person-employee-view.component';

import { DocumentComponent } from './document/document.component';

import { CreditProposalCorrespondenceComponent } from './credit-proposal/correspondence/credit-proposal-correspondence.component';

import { SlikSummaryComponent } from './credit-proposal/slik-summary/slik-summary.component';
import { SlikSummaryDebiturDialogComponent } from './credit-proposal/slik-summary/debitur/slik-summary-debitur-dialog.component';
import { SlikSummaryShareHolderComponent } from './credit-proposal/slik-summary/share-holder/slik-summary-share-holder.component';
import { SlikSummaryShareHolderDialogComponent } from './credit-proposal/slik-summary/share-holder/slik-summary-share-holder-dialog.component';
import { SlikSummaryBusinessGroupComponent } from './credit-proposal/slik-summary/business-group/slik-summary-business-group.component';
import { SlikSummaryBusinessGroupDialogComponent } from './credit-proposal/slik-summary/business-group/slik-summary-business-group-dialog.component';
import { CreditProposalCollateralInfoComponent } from './credit-proposal/collateral-info/credit-proposal-collateral-info.component';
import { CreditProposalPersonalInfoComponent } from './credit-proposal/basic-information/personal-info.component';
import { CreditProposalPersonComponent } from './credit-proposal/credit-proposal-person.component';
import { CreditProposalTabSummaryComponent } from './credit-proposal/credit-proposal-tab-summary.component';
import { AddCoborowerComponent } from './credit-proposal/basic-information/add-new-coborower.component';
import { PartyCifCustomerInfoPersonComponent } from './party-cif/customer-info/party-cif-customer-info-person.component';
import { PostalAddressViewCustomComponent } from './postal-address/postal-address-view-custom.component';
import { CreditProposalCollateralInfoRemarksComponent } from './credit-proposal/collateral-info/remarks/credit-proposal-collateral-info-remarks.component';
import { CreditProposalOpinionHistoryComponent } from './credit-proposal/opinion-history/credit-proposal-opinion-history.component';
import { CreditProposalDialogOpinionHistoryComponent } from './credit-proposal/opinion-history/dialog-opinion-history/credit-proposal-dialog-opinion-history.component';

import { SlikSummaryComparisonComponent } from './credit-proposal/slik-summary/comparison-slik/slik-summary-comparison.component';
import { LoanAnalysSlikIdebComponent } from './credit-proposal/slik-summary/ideb/loan-analys-slik-ideb.component';
import { CollateralPropertyListComponent } from './collateral-property/collateral-property-list.component';
import { CustomerGroupListComponent } from './customer-group/customer-group-list.component';
import { CreditProposalFinancialStatementComponent } from './credit-proposal/financial-statement/credit-proposal-financial-statement.component';
import { RepaymentSpreadsheetComponent } from './credit-proposal/repayment-spreadsheet/repayment-spreadsheet.component';
import { CreditProposalBankAccountAnalystComponent } from './credit-proposal/bank-account-analyst/bank-account-analyst.component';
import { CreditProposalCollateralInfoBTPComponent } from './credit-proposal/collateral-info/backtoback/credit-proposal-collateral-info-btb.component';

// import { CreditProposalProposePricingComponent } from './credit-proposal/propose-pricing/credit-proposal-propose-pricing.component';
import { CreditProposalTabCustomerProfitabilityComponent } from './credit-proposal/tab-customer-profitability/credit-proposal-tab-customer-profitability.component';
import { CollateralTypeDialogComponent } from './party-cif/collateral-info/collateral-type-dialog.component';
import { PartyPostalAddressCardComponent } from './party-postal-address/party-postal-address-card.component';
import { CustomerDetailCardComponent } from './customer/customer-detail-card.component';

import { entityDialogModule } from './entity-dialog.constant';
import { CreditProposalBankAccountAnalystDialogComponent } from './credit-proposal/bank-account-analyst/bank-account-analyst-dialog.component';
import { DeptorDataDocumentChecklistComponent } from './debtor-data/document-checklis/document-checklis-deptor-data.component';
import { DebtorDataDocumentChecklistDialogComponent } from './debtor-data/document-checklis/debtor-data-document-checklis-dialog.component';
import { CreditProposalCollateralInfoChecklistComponent } from './credit-proposal/collateral-info/checklist/credit-proposal-collateral-info-checklist.component';

import { DebtorDataSlikSummaryComponent } from './debtor-data/slick-summary/debtor-data-slik-summary.component';
import { DeborDataSlikSummaryDebiturComponent } from './debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur.component';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur-dialog.component';
import { DebtorDataSlikSummaryDebiturViewComponent } from './debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur-view.component';
import { DebtorDataSlikSummaryShareHolderComponent } from './debtor-data/slick-summary/share-holder/slik-summary-share-holder.component';
import { DebtorDataSlikSummaryShareHolderDialogComponent } from './debtor-data/slick-summary/share-holder/slik-summary-share-holder-dialog.component';
import { DebtorDataSlikSummaryComparisonComponent } from './debtor-data/slick-summary/comparison/debtor-data-comparison.component';
import { DeborDataSlikIdebComponent } from './debtor-data/slick-summary/comparison/ideb/debtor-data-ideb.component';
import { LoanAnalysComplianceComponent } from './loan-analys/compliance/loan-analys-compliance.component';
import { CreditProposalCollateralTabLoanDialogComponent } from './credit-proposal/loan-facility/take-over/collateral/credit-proposal-collateral-tab-loan-dialog.component';
import { CreditProposalCollateralTabLoanAfterDialogComponent } from './credit-proposal/loan-facility/take-over-after/collateral/credit-proposal-collateral-tab-loan-after-dialog.component';
import { ParipasuCollateralComponent } from './credit-proposal/collateral-info/paripasu-collateral/paripasu-collateral.component';
import { DebtorDataOrganizationManagementListComponent } from './debtor-data/slick-summary/management-data/debtor-data-organization-management-list.component';
import { BellowGridComponent } from './credit-proposal/collateral-info/bellow-grid/bellow-grid.component';
import { AboveGridComponent } from './credit-proposal/collateral-info/above-grid/above-grid.component';
import { GroupCollateralComponent } from './credit-proposal/collateral-info/group-collateral/group-collateral.component';
import { CollateralPropertyListPersonalPropertyTemplateComponent } from './collateral-property/templates/collateral-property-list-personal-property-template.component';
import { entityTemplate } from './entity-template.constant';
import { LoanAnalysOpinionComponent } from './loan-analys/opinion/loan-analys-opinion.component';
import { LoanAnalysOpinionCompliancePartComponent } from './loan-analys/opinion/loan-analys-opinion-compliance-part.component';
import { LoanAnalysDialogOpinionComponent } from './loan-analys/dialogs/loan-analys-dialog-opinion.component';
import { LoanAnalysDialogOpinionCompliancePartComponent } from './loan-analys/dialogs/loan-analys-dialog-opinion-compliance-part.component';
import { RetriveComponent } from './credit-proposal/retrive/retrive.component';
import { PartyCifCustomerInfoPartyGroupComponent } from './party-cif/customer-info/party-cif-customer-info-party-group.component';

import { CreditProposalFinancialStatementRemarksComponent } from './credit-proposal/repayment-spreadsheet/remarks/financial-statement-remarks.component';
import { CollateralAppraisalPersonViewComponent } from './collateral-appraisal/collateral-appraisal-person-view.component';
import { CollateralAppraisalPartyGroupViewComponent } from './collateral-appraisal/collateral-appraisal-party-group-view.component';
import { CollateralInfoComponent } from './collateral-appraisal/collateral-info.component';
import { AssignToComponent } from './loan-analys/assign-to/assign-to.component';
import { CreditProposalBankAccountAnalystDialogEditComponent } from './credit-proposal/bank-account-analyst/edit/bank-account-analyst-dialog-edit.component';
import { DebtorDataSlikUploadComponent } from './debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-slik-upload.component';
import { CollateralInfoHistoryComponent } from './credit-proposal/collateral-info-history/collateral-info-history.component';
import { AboveGridHistoryComponent } from './credit-proposal/collateral-info-history/above-grid/above-grid.component';
import { CollateralInfoHistoryDialogComponent } from './credit-proposal/collateral-info-history/dialog/credit-proposal-collateral-info-dialog.component';
import { BellowGridHistoryComponent } from './credit-proposal/collateral-info-history/bellow-grid/bellow-grid.component';
import { CollateralInfoBTPHistoryComponent } from './credit-proposal/collateral-info-history/backtoback/credit-proposal-collateral-info-btb.component';
import { CollateralInfoDialogBTBHistoryComponent } from './credit-proposal/collateral-info-history/backtoback/dialog-credit-proposal-collateral-info-btb.component';
import { CollateralInfoChecklistHistoryComponent } from './credit-proposal/collateral-info-history/checklist/credit-proposal-collateral-info-checklist.component';

// import { ParipasuCollateralHistoryComponent } from './credit-proposal/collateral-info-history/paripasu-collateral/paripasu-collateral.component';
// import { CollateralInfoRemarksHistoryComponent } from './credit-proposal/collateral-info-history/remarks/credit-proposal-collateral-info-remarks.component';
import { LoanFacilityDetailHistoryComponent } from './credit-proposal/loan-facility-history/loan-facility-detail-history.component';
import { LoanFacilityDetailGridHistoryComponent } from './credit-proposal/loan-facility-history/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { LoanFacilityTakeOverGridHistoryComponent } from './credit-proposal/loan-facility-history/take-over/credit-proposal-tab-loan-facility-take-over.grid.component';
import { LoanFacilityTakeOverHistoryComponent } from './credit-proposal/loan-facility-history/take-over/credit-proposal-tab-loan-facility-take-over.component';
import { CollateralTabLoanDialogHistoryComponent } from './credit-proposal/loan-facility-history/take-over/collateral/credit-proposal-collateral-tab-loan-dialog.component';
import { CollateralTabLoanHistoryComponent } from './credit-proposal/loan-facility-history/take-over/collateral/credit-proposal-collateral-tab-loan.component';
import { CreditProposalLoanFacilityDialogHistoryComponent } from './credit-proposal/loan-facility-history/dialog/loan-facility-dialog.component';
// import { MappingCollateralHistoryComponent } from './credit-proposal/loan-facility-history/mapping/mapping-collateral.component';
import { MappingFacilityHistoryComponent } from './credit-proposal/loan-facility-history/mapping/mapping-facility.component';
import { LoanFacilityTakeOverAfterHistoryComponent } from './credit-proposal/loan-facility-history/take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';
import { LoanFacilityTakeOverAfterGridHistoryComponent } from './credit-proposal/loan-facility-history/take-over-after/credit-proposal-tab-loan-facility-take-over-after.grid.component';
import { CollateralTabLoanAfterDialogHistoryComponent } from './credit-proposal/loan-facility-history/take-over-after/collateral/credit-proposal-collateral-tab-loan-after-dialog.component';
import { CollateralTabLoanAfterHistoryComponent } from './credit-proposal/loan-facility-history/take-over-after/collateral/credit-proposal-collateral-tab-loan-after.component';
import { PostalAddressJurisdictionCountryComponent } from './postal-address/postal-address-jurisdiction-country.component';
import { CreditProposalTabCovenantHistoryComponent } from './credit-proposal/convenant-history/credit-proposal-tab-covenant.component';
import { CreditProposalCovenantAboveHistoryComponent } from './credit-proposal/convenant-history/above/credit-proposal-covenant-above.component';
import { CreditProposalDeviationAboveHistoryComponent } from './credit-proposal/convenant-history/above/deviation/credit-proposal-deviation-above.component';
import { CreditProposalCovenantBelowHistoryComponent } from './credit-proposal/convenant-history/below/credit-proposal-covenant-below.component';
import { CreditProposalDeviationBelowHistoryComponent } from './credit-proposal/convenant-history/below/deviation/credit-proposal-deviation-below.component';
import { CovenantBackToBackGeneralHistoryComponent } from './credit-proposal/convenant-history/back-to-back/covenant-backtoback-general.component';
import { CovenantBackToBackDepositHistoryComponent } from './credit-proposal/convenant-history/back-to-back/covenant-backtoback-deposit.component';
import { DeviationBackToBackGeneralHistoryComponent } from './credit-proposal/convenant-history/back-to-back/deviation/deviation-backtoback-general.component';
import { DeviationBackToBackDepositHistoryComponent } from './credit-proposal/convenant-history/back-to-back/deviation/deviation-backtoback-deposit.component';
import { CreditProposalOtherCovenantHistoryComponent } from './credit-proposal/convenant-history/other-covenant/credit-proposal-other-covenant.component';
import { CreditProposalOtherDeviationHistoryComponent } from './credit-proposal/convenant-history/other-covenant/credit-proposal-other-deviation.component';
import { CreditProposalOtherCovenantDialogHistoryComponent } from './credit-proposal/convenant-history/other-covenant/add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditHistoryComponent } from './credit-proposal/convenant-history/other-covenant/edit/credit-proposal-other-covenant-edit.component';
import { CreditProposalBookingBranchComponent } from './credit-proposal/booking-branch/credit-proposal-booking-branch.component';
import { PartyCifCustomerInfoPostalAddressWarehouseComponent } from './party-cif/customer-info/party-cif-customer-info-postal-address-warehouse.component';
import { CreditProposalRepaymentCapabilityComponent } from './credit-proposal/repayment-capability/credit-proposal-repayment-capability.component';
import { ReportIndependentCollateralComponent } from './collateral-appraisal/report-independent/report-independent-collateral.component';
import { PartyCifCustomerManagementComponent } from './party-cif/customer-info/party-cif-customer-management.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralAppraisalDetailProcessRealEstateComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-real-estate.component';
import { CollateralAppraisalDetailProcessLandComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-land.component';
import { CollateralAppraisalDetailProcessLandCertificatesComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-land-certificates.component';
import { PartyCifCustomerInfoPostalAddressComponent } from './party-cif/customer-info/party-cif-customer-info-postal-address.component';
import { PartyCifCustomerInfoPostalAddressEnCifWhComponent } from './party-cif/customer-info/party-cif-customer-info-postal-address-en-cif-wh.component';
import { DebtorDataViewUploadComponent } from './debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-view-upload-slik.component';
// import { CollateralAppraisalNewInfoComponent } from './collateral-appraisal/addSelect/collateral-appraisal-info.component';
// import { TypeDialogAppraisalComponent } from './collateral-appraisal/addSelect/type-dialog-appraisal.component';
import { DarCovenantAboveComponent } from './loan-analys/dar-final/convenant/above/credit-proposal-covenant-above.component';
import { DarCovenantBackToBackDepositComponent } from './loan-analys/dar-final/convenant/back-to-back/covenant-backtoback-deposit.component';
import { DarCovenantBackToBackGeneralComponent } from './loan-analys/dar-final/convenant/back-to-back/covenant-backtoback-general.component';
// import { CollateralAppraisalForwardToComponent } from './collateral-appraisal/summary/forward-to/collateral-appraisal-forward-to.component';
import { BellowGridPreviousComponent } from './credit-proposal/collateral-info-previous/below-grid/below-grid-previous.component';
import { AboveGridPreviousComponent } from './credit-proposal/collateral-info-previous/above-grid/above-grid-previous.component';
import { LoanFacilityDetailPreviousComponent } from './credit-proposal/loan-facility-previous/loan-facility-detail-previous.component';
import { CreditProposalCollateralInfoRemarksInformationComponent } from './credit-proposal/collateral-info/remarks/credit-proposal-collateral-info-remarks-information.component';
import { CreditProposalCollateralInfoRemarksChecklistComponent } from './credit-proposal/collateral-info/remarks/credit-proposal-collateral-info-remarks-checklist.component';
import { AppraisalRoleComponent } from './appraisal-role/appraisal-role.component';
import { ProposalBasicInformationViewComponent } from './credit-proposal/basic-information/basic-information-view.component';
// import { FacilityInfoGroupComponent } from './debtor-data/facility-info/facility-info-group.component';
import { DocumentChecklistDialogHistoryComponent } from './credit-proposal/document-checklist-history/document-checklist-dialog-history.component';
import { CreditProposalDocumentChecklistHistoryComponent } from './credit-proposal/document-checklist-history/credit-proposal-document-checklist-history.component';
import { CovenantTempComponent } from './loan-analys/dar-final/convenant/credit-proposal-tab-covenant.component';
import { OtherCovenantTempComponent } from './loan-analys/dar-final/convenant/other-covenant/credit-proposal-other-covenant.component';
import { OtherCovenantTempDialogComponent } from './loan-analys/dar-final/convenant/other-covenant/add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditTempComponent } from './loan-analys/dar-final/convenant/other-covenant/edit/credit-proposal-other-covenant-edit.component';
import { CreditProposalCovenantBelowTempComponent } from './loan-analys/dar-final/convenant/below/credit-proposal-covenant-below.component';
import { CreditProposalDeviationBelowTempComponent } from './loan-analys/dar-final/convenant/below/deviation/credit-proposal-deviation-below.component';
import { DocumentChecklistTempComponent } from './loan-analys/dar-final/document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogTempComponent } from './loan-analys/dar-final/document-checklist/document-checklist-dialog.component';
import { CreditProposalDeviationDarAboveComponent } from './loan-analys/dar-final/convenant/above/deviation/credit-proposal-deviation-above.component';
import { ApproveFinalComponent } from './loan-analys/approval-final/approve-final.component';
import { CollateralPropertyPersonalCorporateGuaranteeComponent } from './collateral-property/dialogs/collateral-property-personal-corporate-guarantee.component';

import { CreditProposalBranchComponent } from './credit-proposal/booking-branch/credit-proposal-branch.component';
import { GroupCollateralInfoComponent } from './party-cif/group-collateral-list/group-collateral-info.component';
import { GroupCollateralListComponent } from './party-cif/group-collateral-list/group-collateral-list.component';
import { GroupCollateralListCpComponent } from './credit-proposal/collateral-info/group-collateral/group-collateral-list-cp.component';
import { ParipasuCollateralDebiturComponent } from './credit-proposal/collateral-info/paripasu-collateral-debitur/paripasu-collateral-debitur.component';
import { ParipasuCollateralGroupComponent } from './credit-proposal/collateral-info/paripasu-collateral-group/paripasu-collateral-group.component';
import { SummaryGridComponent } from './credit-proposal/collateral-info/collateral-summary/summary-grid.component';
import { SummaryGridBtbComponent } from './credit-proposal/collateral-info/collateral-summary-btb/summary-grid-btb.component';
import { MainFacilityInfoComponent } from './debtor-data/facility-info/main-facility-info.component';
import { MainFacilityInfoChildComponent } from './debtor-data/facility-info/main-facility-info-child.component';
import { DebtorInformationComponent } from './debtor-information/debtor-information.component';
import { MainFacilityHistoryComponent } from './credit-proposal/loan-facility-history/main-facility/main-facility-history.component';
import { MainFacilityChildHistoryComponent } from './credit-proposal/loan-facility-history/main-facility/main-facility-child-history.component';
import { CertificateInfoComponent } from './offering-letter/certificate-info/certificate-info.component';
import { GroupCollateralListHistoryComponent } from './credit-proposal/collateral-info-history/group-collateral/group-collateral-list-history.component';
import { GroupCollateralHistoryComponent } from './credit-proposal/collateral-info-history/group-collateral/group-collateral-history.component';
import { GroupCollateralDarComponent } from './loan-analys/dar-final/collateral-info/group-collateral/group-collateral-dar.component';
import { GroupCollateralListDarComponent } from './loan-analys/dar-final/collateral-info/group-collateral/group-collateral-list-dar.component';
import { CreditProposalSummaryGenerateMemoBandingComponent } from './credit-proposal/credit-proposal-summary-generate-memo-banding.component';
import { CreditProposalCollateralSummaryDialogComponent } from './credit-proposal/collateral-info/collateral-summary/credit-proposal-collateral-summary-dialog.component';
import { AgremeentCompareRevisionFinalComponent } from './credit-agreement/compare-data-agremeent/dar-revision-final/agreement-compare-revision-final.component';
import { AgreementComparePreviousDarComponent } from './credit-agreement/compare-data-agremeent/previous-dar/agreement-compare-previous-dar.component';
import { SignerPerjanjialKreditDialogComponent } from './credit-agreement/finalize-credit-agreement/signer-perjanjian-kredit-dialog/signer-perjanjian-kredit-dialog.component';
import { CreditProposalGeneratePkReportComponent } from './credit-proposal/generate-document-pk-report/credit-proposal-generate-pk-report.component';
import { OfferingLetterSignerPageComponent } from './offering-letter/offering-page/signer/signer-page.component';
import { OfferingLetterSignerPageDialogComponent } from './offering-letter/offering-page/signer/dialog/signer-page-dialog.component';
import { AboveGridDarFinalComponent } from './loan-analys/dar-final/collateral-info/above-grid/above-grid.component';
import { CollateralInfoBTPDarFinalComponent } from './loan-analys/dar-final/collateral-info/backtoback/credit-proposal-collateral-info-btb.component';
import { CollateralInfoDialogBTBDarFinalComponent } from './loan-analys/dar-final/collateral-info/backtoback/dialog-credit-proposal-collateral-info-btb.component';
import { BellowGridDarFinalComponent } from './loan-analys/dar-final/collateral-info/bellow-grid/bellow-grid.component';
import { CollateralInfoDarFinalComponent } from './loan-analys/dar-final/collateral-info/credit-proposal-collateral-info.component';
import { CollateralInfoDialogTempComponent } from './loan-analys/dar-final/collateral-info/dialog/collateral-info-dialog-temp.component';
import { LoanFacilityDetailTempComponent } from './loan-analys/dar-final/loan-facility/credit-proposal-tab-loan-facility-detail.component';
import { LoanFacilityDialogTempComponent } from './loan-analys/dar-final/loan-facility/dialog/loan-facility-dialog.component';
import { LoanFacilityDetailGridTempComponent } from './loan-analys/dar-final/loan-facility/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { MainFacilityChildDarComponent } from './loan-analys/dar-final/loan-facility/main-facility/main-facility-child-dar.component';
import { MainFacilityDarComponent } from './loan-analys/dar-final/loan-facility/main-facility/main-facility-dar.component';
import { MainFacilityDialogDarComponent } from './loan-analys/dar-final/loan-facility/main-facility/main-facility-dialog-dar.component';
import { MappingFacilityTempComponent } from './loan-analys/dar-final/loan-facility/mapping/mapping-facility.component';
import { DeveloperShowDiagramStateMultipleComponent } from 'app/developer/reuseable/diagram-state-multiple.component';
import { DeveloperShowDiagramStateMultipleDialogComponent } from 'app/developer/reuseable/dialog/diagram-state-multiple-dialog.component';
import { CompareDataComponent, CompareDataNotFoundComponent } from './compare-data/compare-data.component';
import { CompareDataLoanFacilityComponent } from './compare-data/loan-facility/compare-data-loan-facility.component';
import { CompareDataLoanFacilityGridComponent } from './compare-data/loan-facility/grid/compare-data-loan-facility-grid.component';
import { CompareDataLoanFacilityDialogComponent } from './compare-data/loan-facility/dialog/compare-data-loan-facility-dialog.component';
import { CompareDataCovenantComponent } from './compare-data/covenant/compare-data-covenant.component';
import { CompareDataCovenantGridComponent } from './compare-data/covenant/grid/compare-data-covenant-grid.component';
import { CompareDataCovenantOtherComponent } from './compare-data/covenant/other/compare-data-covenant-other.component';
import { CompareDataCovenantOtherDialogComponent } from './compare-data/covenant/other/dialog/compare-data-covenant-other-dialog.component';
import { LoanPurposeComponent } from './loan-purpose/loan-purpose.component';
import { CountMVOriginalPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/count-mv-original.pipe';
import { GetCurrencyPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/get-currency.pipe';
import { CountMVPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/count-mv.pipe';
import { CustomPercentagePipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/percentage.pipe';
import { CountLVPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/count-lv.pipe';
import { CountKjjpMvPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/count-kjjp-mv.pipe';
import { CountKjjpLvPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/count-kjjp-lv.pipe';
import { GetMarketabilityPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/get-marketability.pipe';
import { GetOwnershipPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/get-ownership.pipe';
import { GetExpiryPipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/get-expiry.pipe';
import { GetBindingTypePipe } from './credit-proposal/memo-banding/memo-banding-collateral/pipes/get-binding-type.pipe';
import { ClausalPkDialogComponent } from './credit-agreement/finalize-credit-agreement/clausal-pk-dialog/clausal-pk-dialog.component';
import { ClausalPkDialogComponentEditComponent } from './credit-agreement/finalize-credit-agreement/clausal-pk-dialog/clausal-pk-dialog-edit.component';
import { InsuranceInfoDialogComponent } from './insurance-information/dialog/insurance-info-dialog.component';
import { GridDetailInsuranceComponent } from './insurance-information/grid-detail-insurance.component';
import { InsuranceInfoDialogDetailComponent } from './insurance-information/dialog/insurance-info-dialog-detail.component';
import { InsuranceDocumentDialogComponent } from './insurance-information/document/insurance-document-dialog.component';
import { InsuranceDocumentComponent } from './insurance-information/document/insurance-document.component';
import { BindingValueInformationComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information.component';
import { BindingValueInformationGridComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-grid/binding-value-information-grid.component';
import { InternalMemoComponent } from './dpdl-finalize/internal memo/internal-memo.component';
import { DocumentLegalDialogComponent } from './dpdl-finalize/dpdl-document/document-legal/document-legal-dialog.component';
import { DocumentLegalComponent } from './dpdl-finalize/dpdl-document/document-legal/document-legal.component';
import { DpdlDocumentComponent } from './dpdl-finalize/dpdl-document/dpdl-document.component';
import { GenerateDpdlDraftComponent } from './dpdl-finalize/dpdl-document/generate-dpdl/generate-dpdl-draft.component';
import { DocumentDpdlDetailDialogComponent } from './dpdl-finalize/dpdl-document/legal-document-upload/document-dpdl-detail-dialog.component';
import { DocumentDpdlUploadDialogComponent } from './dpdl-finalize/dpdl-document/legal-document-upload/document-dpdl-upload-dialog.component';
import { DocumentLegalUploadComponent } from './dpdl-finalize/dpdl-document/legal-document-upload/document-legal-upload.component';
import { DocumentLegalDetailDialogComponent } from './dpdl-finalize/dpdl-document/document-legal/document-legal-detail-dialog.component';
import { InternalMemoDetailComponent } from './dpdl-finalize/internal memo/dialog/dialog-internal-memo-detail.component';
import { DpdlPreparationComponent } from './dpdl-finalize/dpdl-document/dpdl-preparation/dpdl-preparation.component';
import { BindingValueInformationDialogComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-information-dialog.component';
import { BindingValueRealEstateGridComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-real-estate-grid/binding-value-real-estate-grid.component';
import { BindingValueRealEstateDialogComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-real-estate-grid/binding-value-real-estate-dialog.component';
import { BindingValueMachineGridComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-machine-grid/binding-value-machine-grid.component';
import { BindingValueMachineDialogComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-machine-grid/binding-value-machine-dialog.component';
import { BindingValueDepositoDialogComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-deposito-grid/binding-value-deposito-dialog.component';
import { BindingValueDepositoGridComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-deposito-grid/binding-value-deposito-grid.component';
import { BindingValueGeneralGridComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-general-grid/binding-value-general-grid.component';
import { BindingValueGeneralDialogComponent } from './credit-proposal/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-general-grid/binding-value-general-dialog.component';
import { LoaderBAComponent } from './credit-proposal/busines-activity/loader-ba.component';
import { ScrollComponent } from 'app/shared/scroll-up/scroll-up.component';
import { CreditProposalGroupGuarantorAnalysisComponent } from './credit-proposal/guarantour/credit-proposal-group-guarantor-analysis.component';
import { DppkPreparationComponent } from './dppk-finalize/dppk-preparation/dppk-preparation.component';
import { BankAccountComponent } from './dppk-finalize/dppk-preparation/bank-account/bank-account.component';
import { BankAccountDialogComponent } from './dppk-finalize/dppk-preparation/bank-account/bank-account-dialog.component';
import { GenerateDraftDppkComponent } from './dppk-finalize/dppk-preparation/generate-draft-dppk/generate-draft-dppk.component';
import { DppkAssignToComponent } from './dppk-finalize/dppk-assign-to/dppk-assign-to.component';
import { DppkPreparationInternalMemoComponent } from './dppk-finalize/dppk-preparation/dppk-preparation-internal-memo/dppk-preparation-internal-memo.component';
import { DppkPreparationInternalMemoDialogComponent } from './dppk-finalize/dppk-preparation/dppk-preparation-internal-memo/dppk-preparation-internal-memo-dialog.component';
import { DppkPreparationInternalMemoDialogDetailComponent } from './dppk-finalize/dppk-preparation/dppk-preparation-internal-memo/dppk-preparation-internal-memo-dialog-detail.component';
import { CollateralOwnerAddressComponent } from './party-cif/collateral-info/collateral-owner-address.component';
import { entityDppkFinalizeTemplate } from './entity-dppk-finalize-template.constant';
import { LoanOperationLoanFacilityTemplate } from './loan-operation/loan-facility-detail/loan-operation-loan-facility-template';
import { DocumentLegalDetailDialogLoanOperationComponent } from './loan-operation/dpdl-document/document-legal/document-legal-detail-dialog.component';
import { DocumentLegalLoanOperationComponent } from './loan-operation/dpdl-document/document-legal/document-legal.component';
import { DpdlPreparationLoanOperationComponent } from './loan-operation/dpdl-document/dpdl-preparation/dpdl-preparation.component';
import { GenerateDpdlDraftLoanOperationComponent } from './loan-operation/dpdl-document/generate-dpdl/generate-dpdl-draft.component';
import { DocumentDpdlDetailDialogLoanOperationComponent } from './loan-operation/dpdl-document/legal-document-upload/document-dpdl-detail-dialog.component';
import { DocumentDpdlUploadDialogLoanOperationComponent } from './loan-operation/dpdl-document/legal-document-upload/document-dpdl-upload-dialog.component';
import { DocumentLegalUploadLoanOperationComponent } from './loan-operation/dpdl-document/legal-document-upload/document-legal-upload.component';
import { DpdlDocumentLoanOperationComponent } from './loan-operation/dpdl-document/dpdl-document.component';
import { InternalMemoDetailLoanOperationComponent } from './loan-operation/internal memo/dialog/dialog-internal-memo-detail.component';
import { DialogInternalMemoComponent } from './dpdl-finalize/internal memo/dialog/dialog-internal-memo.component';
import { DialogInternalMemoLoanOperationComponent } from './loan-operation/internal memo/dialog/dialog-internal-memo.component';
import { InternalMemoLoanOperationComponent } from './loan-operation/internal memo/internal-memo.component';
import { CollateralInfoLoanOpsComponent } from './loan-operation/collateral-info/collateral-info-loan-ops.component';
import { AboveGridLoanOpsComponent } from './loan-operation/collateral-info/above-grid/above-grid-loan-ops.component';
import { CollateralInfoBTBLoanOpsComponent } from './loan-operation/collateral-info/backtoback/collateral-info-btb-loan-ops.component';
import { DialogCollateralInfoDialogBTBComponent } from './loan-operation/collateral-info/backtoback/dialog-collateral-info-btb-loan-ops.component';
import { BellowGridLoanOpsComponent } from './loan-operation/collateral-info/bellow-grid/bellow-grid-loan-ops.component';
import { BindingValueInformationLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-loan-ops.component';
import { BindingValueDepositoDialogLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-deposito-grid/binding-value-deposito-dialog-loan-ops.component';
import { BindingValueDepositoGridLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-deposito-grid/binding-value-deposito-grid-loan-ops.component';
import { BindingValueGeneralDialogLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-general-grid/binding-value-general-dialog-loan-ops.component';
import { BindingValueGeneralGridLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-general-grid/binding-value-general-grid-loan-ops.component';
import { BindingValueMachineDialogLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-machine-grid/binding-value-machine-dialog-loan-ops.component';
import { BindingValueMachineGridLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-machine-grid/binding-value-machine-grid-loan-ops.component';
import { BindingValueRealEstateDialogLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-real-estate-grid/binding-value-real-estate-dialog-loan-ops.component';
import { BindingValueRealEstateGridLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-real-estate-grid/binding-value-real-estate-grid-loan-ops.component';
import { BindingValueInformationDialogLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-dialog/binding-value-information-dialog-loan-ops.component';
import { BindingValueInformationGridLoanOpsComponent } from './loan-operation/collateral-info/binding-value-information/binding-value-information-grid/binding-value-information-grid-loan-ops.component';
import { CollateralInfoChecklistLoanOpsComponent } from './loan-operation/collateral-info/checklist/collateral-info-checklist-loan-ops.component';
import { CollateralSummaryDialogLoanOpsComponent } from './loan-operation/collateral-info/collateral-summary/collateral-summary-dialog-loan-ops.component';
import { SummaryGridLoanOpsComponent } from './loan-operation/collateral-info/collateral-summary/summary-grid-loan-ops.component';
import { SummaryGridBtbLoanOpsComponent } from './loan-operation/collateral-info/collateral-summary-btb/summary-grid-btb-loan-ops.component';
import { GroupCollateralListLoanOpsComponent } from './loan-operation/collateral-info/group-collateral/group-collateral-list-loan-ops.component';
import { GroupCollateralLoanOpsComponent } from './loan-operation/collateral-info/group-collateral/group-collateral-loan-ops.component';
import { CollateralInfoRemarksChecklistLoanOpsComponent } from './loan-operation/collateral-info/remarks/collateral-info-remarks-checklist-loan-ops.component';
import { CollateralInfoRemarksInformationLoanOpsComponent } from './loan-operation/collateral-info/remarks/collateral-info-remarks-information-loan-ops.component';
import { CollateralInfoRemarksLoanOpsComponent } from './loan-operation/collateral-info/remarks/collateral-info-remarks-loan-ops.component';
import { MappingFacilityLoanOpsComponent } from './loan-operation/collateral-info/mapping/mapping-facility-loan-ops.component';
import { GenerateTboLegalMonitoringComponent } from './tbo-legal-monitoring/generate-tbo-legal-monitoring/generate-tbo-legal-monitoring.component';
import { TboLegalMonitoringComponent } from './tbo-legal-monitoring/tbo-monitoring/tbo-legal-monitoring.component';
import { HistoryTBOComponent } from './tbo-legal-monitoring/history-tbo/history-tbo.component';
import { CollateralInfoDialogLoanOpsComponent } from './loan-operation/collateral-info/dialog/collateral-info-dialog-loan-ops.component';
import { DisbursmentApproveComponent } from './loan-ops-review/disbursment -status/disbursment-approve.component';
import { DocumentChecklistOpinionComponent } from './document-checklist-opinion/document-checklist-opinion.component';
import { TboLegalMonitoringDetailComponent } from './tbo-legal-monitoring/tbo-monitoring/dialog/tbo-legal-monitoring-detail.component';
import { TboLegalMonitoringViewComponent } from './tbo-legal-monitoring/tbo-monitoring/dialog/tbo-legal-monitoring-view.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    // primeng
    DataViewModule,
    TableModule,
    CalendarModule,
    ListboxModule,
    AutoCompleteModule,
    PanelModule,
    DialogModule,
    CheckboxModule,
    ConfirmDialogModule,
    CardModule,

    // angular material
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule,

    // ngx
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  // prettier-ignore
  declarations: [
    ...entityDialogModule,
    ...entityTemplate,
    ...entityDppkFinalizeTemplate,
    PartyCifCustomerInfoPostalAddressComponent,
    PartyCifCustomerInfoPostalAddressEnCifWhComponent,
    PartyCifCustomerInfoPartyGroupComponent,
    PartyCifCustomerInfoPersonComponent,
    PartyCifCustomerManagementComponent,
    PersonEmployeeViewComponent,
    CollateralUpdateComponent,
    PartyViewComponent,
    PersonViewComponent,
    PartyGroupViewComponent,
    PartyTypeViewComponent,
    ProductViewComponent,
    FeatureViewComponent,
    PostalAddressViewComponent,
    // GeoBoundaryViewComponent,
    // ProductCategoryEditDialogComponent,
    // InternalViewComponent,
    PartyPaymentPrefViewComponent,
    CifViewComponent,
    CollateralViewComponent,
    CreditRatingViewComponent,
    EmploymentViewComponent,
    CifViewCustomComponent,
    CollateralAppraisalInfoComponent,
    CollateralAppraisalExternalOfficerComponent,
    CollateralAppraisalDetailProcessMesinComponent,
    CollateralAppraisalNegativeCollateralComponent,
    CollateralAppraisalComparisonComponent,
    CollateralAppraisalProcessComponent,
    CollateralAppraisalSummaryComponent,
    DocumentComponent,
    CreditProposalCorrespondenceComponent,
    SlikSummaryComponent,
    SlikSummaryDebiturDialogComponent,
    SlikSummaryShareHolderComponent,
    SlikSummaryShareHolderDialogComponent,
    SlikSummaryBusinessGroupComponent,
    SlikSummaryBusinessGroupDialogComponent,
    SlikSummaryComparisonComponent,
    LoanAnalysSlikIdebComponent,
    CreditProposalCollateralInfoComponent,
    CreditProposalPersonalInfoComponent,
    CreditProposalPersonComponent,
    CreditProposalTabSummaryComponent,
    AddCoborowerComponent,
    PostalAddressViewCustomComponent,
    CreditProposalCollateralInfoRemarksComponent,
    CreditProposalOpinionHistoryComponent,
    CreditProposalDialogOpinionHistoryComponent,
    CreditProposalCollateralInfoRemarksChecklistComponent,
    CreditProposalCollateralInfoRemarksInformationComponent,
    CollateralPropertyListComponent,
    CustomerGroupListComponent,
    CreditProposalGroupGuarantorAnalysisComponent,
    LoaderBAComponent,
    CreditProposalFinancialStatementComponent,
    RepaymentSpreadsheetComponent,
    CreditProposalBankAccountAnalystComponent,
    DeptorDataDocumentChecklistComponent,
    // CreditProposalProposePricingComponent,
    CreditProposalCollateralInfoBTPComponent,
    CreditProposalTabCustomerProfitabilityComponent,
    CollateralTypeDialogComponent,
    PartyPostalAddressCardComponent,
    CustomerDetailCardComponent,
    // OrganizationLegalListComponent,
    CreditProposalBankAccountAnalystDialogComponent,
    DebtorDataDocumentChecklistDialogComponent,
    CreditProposalCollateralInfoChecklistComponent,
    DebtorDataSlikSummaryComponent,
    DeborDataSlikSummaryDebiturComponent,
    DebtorDataSlikSummaryDebiturDialogComponent,
    DebtorDataSlikSummaryDebiturViewComponent,
    DebtorDataSlikSummaryShareHolderComponent,
    DebtorDataSlikSummaryShareHolderDialogComponent,
    DebtorDataSlikSummaryComparisonComponent,
    DeborDataSlikIdebComponent,
    LoanAnalysComplianceComponent,
    CreditProposalCollateralTabLoanDialogComponent,
    CreditProposalCollateralTabLoanAfterDialogComponent,
    
    ParipasuCollateralComponent,
    DebtorDataOrganizationManagementListComponent,
    RetriveComponent,
    CreditProposalFinancialStatementRemarksComponent,
    CreditProposalBankAccountAnalystDialogEditComponent,
    CreditProposalBookingBranchComponent,
    CreditProposalBranchComponent,
    PartyCifCustomerInfoPostalAddressWarehouseComponent,
    ProposalBasicInformationViewComponent,
    // mapping collateral


    // === Previous === //

    // Loan Facility Detail
    LoanFacilityDetailPreviousComponent,

    // Collateral Info
    // === BELOW === //
    BellowGridPreviousComponent,
    // === ABOVE === //
    AboveGridPreviousComponent,

    //  ==== Previous Covenant Deviation ====  //

    // Above

    // Other Deviation

    // Main Covenant
    BellowGridComponent,
    AboveGridComponent,
    GroupCollateralComponent,
    CollateralPropertyListPersonalPropertyTemplateComponent,
    LoanAnalysOpinionComponent,
    LoanAnalysOpinionCompliancePartComponent,
    LoanAnalysDialogOpinionComponent,
    LoanAnalysDialogOpinionCompliancePartComponent,
    CollateralAppraisalPersonViewComponent,
    CollateralAppraisalPartyGroupViewComponent,
    AssignToComponent,
    /* jhipster-needle-declaration-entity-as-list */
    DebtorDataSlikUploadComponent,

    // Credit Proposal History
    CollateralInfoHistoryComponent,
    // Above
    AboveGridHistoryComponent,
    // Dialog
    CollateralInfoHistoryDialogComponent,
    CollateralInfoDialogBTBHistoryComponent,
    // Below
    BellowGridHistoryComponent,
    // Back to Back
    CollateralInfoBTPHistoryComponent,
    // Checklist
    CollateralInfoChecklistHistoryComponent,
    // Group Collateral
    GroupCollateralListHistoryComponent,
    GroupCollateralHistoryComponent,
    // Paripaasu Collateral
    // ParipasuCollateralHistoryComponent,
    // Remarks
    // CollateralInfoRemarksHistoryComponent,

    // === Loan Facility History === //
    LoanFacilityDetailHistoryComponent,
    // grid
    LoanFacilityDetailGridHistoryComponent,
    // Take over
    LoanFacilityTakeOverHistoryComponent,
    LoanFacilityTakeOverGridHistoryComponent,
    // Take over -> Collateral
    CollateralTabLoanDialogHistoryComponent,
    CollateralTabLoanHistoryComponent,
    // dialog
    CreditProposalLoanFacilityDialogHistoryComponent,
    // mapping
    // MappingCollateralHistoryComponent,
    MappingFacilityHistoryComponent,
    // Take over after
    LoanFacilityTakeOverAfterHistoryComponent,
    LoanFacilityTakeOverAfterGridHistoryComponent,
    // Take over after -> Collateral
    CollateralTabLoanAfterDialogHistoryComponent,
    CollateralTabLoanAfterHistoryComponent,
    PostalAddressJurisdictionCountryComponent,
    // === CONVENAT HISTORY === //
    CreditProposalTabCovenantHistoryComponent,
    // Above
    CreditProposalCovenantAboveHistoryComponent,
    CreditProposalDeviationAboveHistoryComponent,
    // Below
    CreditProposalCovenantBelowHistoryComponent,
    CreditProposalDeviationBelowHistoryComponent,
    // Back to Back
    CovenantBackToBackGeneralHistoryComponent,
    CovenantBackToBackDepositHistoryComponent,
    DeviationBackToBackGeneralHistoryComponent,
    DeviationBackToBackDepositHistoryComponent,
    // Other Covenant
    CreditProposalOtherCovenantHistoryComponent,
    CreditProposalOtherDeviationHistoryComponent,
    // Dialog
    CreditProposalOtherCovenantDialogHistoryComponent,
    CreditProposalOtherCovenantEditHistoryComponent,
    // Repayment Capability
    CreditProposalRepaymentCapabilityComponent,
    // Trade Checking
    CollateralInfoComponent,
    ReportIndependentCollateralComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalDetailProcessLandCertificatesComponent,
    CollateralAppraisalDetailProcessLandComponent,
    DebtorDataViewUploadComponent,
    // CollateralAppraisalNewInfoComponent,
    // TypeDialogAppraisalComponent,
    DarCovenantAboveComponent,
    DarCovenantBackToBackDepositComponent,
    DarCovenantBackToBackGeneralComponent,
    // CollateralAppraisalForwardToComponent,
    AppraisalRoleComponent,
    // FacilityInfoGroupComponent,
    CreditProposalDocumentChecklistHistoryComponent,
    DocumentChecklistDialogHistoryComponent,
    CovenantTempComponent,
    OtherCovenantTempComponent,
    OtherCovenantTempDialogComponent,
    CreditProposalOtherCovenantEditTempComponent,
    CreditProposalCovenantBelowTempComponent,
    CreditProposalDeviationBelowTempComponent,
    DocumentChecklistTempComponent,
    DocumentChecklistDialogTempComponent,
    CreditProposalDeviationDarAboveComponent,
    ApproveFinalComponent,
    DisbursmentApproveComponent,
    CollateralPropertyPersonalCorporateGuaranteeComponent,


    GroupCollateralInfoComponent,
    GroupCollateralListComponent,
    // cross cp //
    ParipasuCollateralGroupComponent,
    ParipasuCollateralDebiturComponent,
    GroupCollateralListCpComponent,
    SummaryGridComponent,
    // InsuranceInformationIddComponent,

    // cross appraisal //
    // GroupCollateralListAppraisalComponent,
    // GroupCollateralAppraisalComponent,
    SummaryGridBtbComponent,

    // cross dar //
    GroupCollateralDarComponent,
    GroupCollateralListDarComponent,
    MainFacilityInfoComponent,
    MainFacilityInfoChildComponent,
    DebtorInformationComponent,
    MainFacilityHistoryComponent,
    MainFacilityChildHistoryComponent,
    CertificateInfoComponent,
    CreditProposalSummaryGenerateMemoBandingComponent,
    CreditProposalCollateralSummaryDialogComponent,
    BindingValueInformationDialogComponent,
    BindingValueRealEstateGridComponent,
    BindingValueRealEstateDialogComponent,
    BindingValueMachineGridComponent,
    BindingValueMachineDialogComponent,
    BindingValueDepositoGridComponent,
    BindingValueDepositoDialogComponent,

    // Aggrement Compare
    AgremeentCompareRevisionFinalComponent,
    AgreementComparePreviousDarComponent,
    SignerPerjanjialKreditDialogComponent,
    CreditProposalGeneratePkReportComponent,
    OfferingLetterSignerPageComponent,
    OfferingLetterSignerPageDialogComponent,
    ClausalPkDialogComponent,


// DAR
    LoanFacilityDetailTempComponent,
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
    CollateralInfoDarFinalComponent,
    AboveGridDarFinalComponent,
    BellowGridDarFinalComponent,
    CollateralInfoBTPDarFinalComponent,
    CollateralInfoDialogBTBDarFinalComponent,
    CollateralInfoDialogTempComponent,
    MappingFacilityTempComponent,
    MainFacilityDarComponent,
    MainFacilityChildDarComponent,
    MainFacilityDialogDarComponent,
    InsuranceInfoDialogComponent,
    GridDetailInsuranceComponent,
    InsuranceInfoDialogDetailComponent,
    InsuranceDocumentComponent,
    InsuranceDocumentDialogComponent,
    // DEV
    DeveloperShowDiagramStateMultipleComponent,
    DeveloperShowDiagramStateMultipleDialogComponent,
    ClausalPkDialogComponentEditComponent,

    //   New Compare Data
    CompareDataComponent,
    CompareDataNotFoundComponent,
    CompareDataLoanFacilityComponent,
    CompareDataLoanFacilityGridComponent,
    CompareDataLoanFacilityDialogComponent,
    CompareDataCovenantComponent,
    CompareDataCovenantGridComponent,
    CompareDataCovenantOtherComponent,
    CompareDataCovenantOtherDialogComponent,

    LoanPurposeComponent,

    BindingValueInformationComponent,
    BindingValueInformationGridComponent,
    InternalMemoComponent,
    InternalMemoLoanOperationComponent,
    DialogInternalMemoComponent,
    DialogInternalMemoLoanOperationComponent,

    // generate tbo monitoring
    GenerateTboLegalMonitoringComponent,

    // tbo-legal-monitoring
    TboLegalMonitoringComponent,

    // tbo-monitoring-detail
    TboLegalMonitoringDetailComponent,

    // tbo-monitoring-view
    TboLegalMonitoringViewComponent,

    // history-tbo
    HistoryTBOComponent,

     // Document Legal DPDL
    DocumentLegalUploadComponent,
    DocumentLegalUploadLoanOperationComponent,
    DocumentDpdlUploadDialogComponent,
    DocumentDpdlUploadDialogLoanOperationComponent,
    DocumentDpdlDetailDialogComponent,
    DocumentDpdlDetailDialogLoanOperationComponent,

    DocumentLegalComponent,
    DocumentLegalLoanOperationComponent,
    DocumentLegalDialogComponent,
    DocumentLegalDetailDialogLoanOperationComponent,
    DocumentLegalDetailDialogComponent,
    DpdlDocumentComponent,
    DpdlDocumentLoanOperationComponent,
    GenerateDpdlDraftComponent,
    GenerateDpdlDraftLoanOperationComponent,
    InternalMemoDetailComponent,
    InternalMemoDetailLoanOperationComponent,
    DpdlPreparationComponent,
    DpdlPreparationLoanOperationComponent,
    BindingValueGeneralGridComponent,
    BindingValueGeneralDialogComponent,

    // scroll-up
    ScrollComponent,

    // DPPK Preparation
    DppkPreparationComponent,
    BankAccountComponent,
    BankAccountDialogComponent,
    GenerateDraftDppkComponent,
    DppkAssignToComponent,
    DppkPreparationInternalMemoComponent,
    DppkPreparationInternalMemoDialogComponent,
    DppkPreparationInternalMemoDialogDetailComponent,
    CollateralOwnerAddressComponent,
    // Loan Ops Collateral Info
    CollateralInfoLoanOpsComponent,
    AboveGridLoanOpsComponent,
    CollateralInfoBTBLoanOpsComponent,
    DialogCollateralInfoDialogBTBComponent,
    BellowGridLoanOpsComponent,
    BindingValueInformationLoanOpsComponent,
    BindingValueDepositoDialogLoanOpsComponent,
    BindingValueDepositoGridLoanOpsComponent,
    BindingValueGeneralDialogLoanOpsComponent,
    BindingValueGeneralGridLoanOpsComponent,
    BindingValueMachineDialogLoanOpsComponent,
    BindingValueMachineGridLoanOpsComponent,
    BindingValueRealEstateDialogLoanOpsComponent,
    BindingValueRealEstateGridLoanOpsComponent,
    BindingValueInformationDialogLoanOpsComponent,
    BindingValueInformationGridLoanOpsComponent,
    CollateralInfoChecklistLoanOpsComponent,
    CollateralSummaryDialogLoanOpsComponent,
    SummaryGridLoanOpsComponent,
    SummaryGridBtbLoanOpsComponent,
    GroupCollateralListLoanOpsComponent,
    GroupCollateralLoanOpsComponent,
    CollateralInfoRemarksChecklistLoanOpsComponent,
    CollateralInfoRemarksInformationLoanOpsComponent,
    CollateralInfoRemarksLoanOpsComponent,
    MappingFacilityLoanOpsComponent,
    CollateralInfoDialogLoanOpsComponent,
    ...LoanOperationLoanFacilityTemplate,
	DocumentChecklistOpinionComponent
  ],
  exports: [
    ...entityDialogModule,
    ...entityTemplate,
    ...LoanOperationLoanFacilityTemplate,
    ...entityDppkFinalizeTemplate,
    LoanPurposeComponent,

    //   New Compare Data
    CompareDataComponent,
    CompareDataNotFoundComponent,
    CompareDataLoanFacilityComponent,
    CompareDataLoanFacilityGridComponent,
    CompareDataLoanFacilityDialogComponent,
    CompareDataCovenantComponent,
    CompareDataCovenantGridComponent,
    CompareDataCovenantOtherComponent,
    CompareDataCovenantOtherDialogComponent,

    PartyCifCustomerInfoPostalAddressComponent,
    PartyCifCustomerInfoPostalAddressEnCifWhComponent,
    PartyCifCustomerInfoPartyGroupComponent,
    PartyCifCustomerInfoPersonComponent,
    PartyCifCustomerManagementComponent,
    DocumentComponent,
    PersonEmployeeViewComponent, // Remove Me
    CollateralUpdateComponent, // Remove Me
    PartyViewComponent, // Remove Me
    PersonViewComponent, // Remove Me
    PartyGroupViewComponent, // Remove Me
    PartyTypeViewComponent, // Remove Me
    ProductViewComponent, // Remove Me
    FeatureViewComponent, // Remove Me
    PostalAddressViewComponent, // Remove Me
    // GeoBoundaryViewComponent, // Remove Me
    // InternalViewComponent, // Remove Me
    PartyPaymentPrefViewComponent, // Remove Me
    CifViewComponent, // Remove Me
    CollateralViewComponent, // Remove Me
    CreditRatingViewComponent, // Remove Me
    EmploymentViewComponent, // Remove Me
    CifViewCustomComponent, // Remove Me
    CollateralAppraisalInfoComponent, // Remove Me
    CollateralAppraisalExternalOfficerComponent, // Remove Me
    CollateralAppraisalDetailProcessMesinComponent, // Remove Me
    CollateralAppraisalNegativeCollateralComponent, // Remove Me
    CollateralAppraisalComparisonComponent, // Remove Me
    CollateralAppraisalProcessComponent, // Remove Me
    CollateralAppraisalSummaryComponent, // Remove Me
    CreditProposalCorrespondenceComponent, // Remove Me
    SlikSummaryComponent, // Remove Me
    SlikSummaryDebiturDialogComponent, // Remove Me
    SlikSummaryShareHolderComponent, // Remove Me
    SlikSummaryShareHolderDialogComponent, // Remove Me
    SlikSummaryBusinessGroupComponent, // Remove Me
    SlikSummaryComparisonComponent, // Remove Me
    LoanAnalysSlikIdebComponent, // Remove Me
    CreditProposalPersonalInfoComponent, // Remove Me
    CreditProposalPersonComponent, // Remove Me
    CreditProposalTabSummaryComponent, // Remove Me
    SlikSummaryBusinessGroupDialogComponent, // Remove Me
    CreditProposalCollateralInfoComponent, // Remove Me
    AddCoborowerComponent, // Remove Me
    PostalAddressViewCustomComponent, // Remove Me
    CreditProposalCollateralInfoRemarksComponent, // Remove Me
    CreditProposalOpinionHistoryComponent, // Remove Me
    CreditProposalCollateralInfoRemarksChecklistComponent,
    CreditProposalDialogOpinionHistoryComponent, // Remove Me
    CollateralPropertyListComponent,
    CreditProposalCollateralInfoRemarksInformationComponent,
    CustomerGroupListComponent,
    CreditProposalGroupGuarantorAnalysisComponent,
    LoaderBAComponent,
    CreditProposalFinancialStatementComponent, // Remove Me
    RepaymentSpreadsheetComponent, // Remove Me
    CreditProposalBankAccountAnalystComponent, // Remove Me
    // CreditProposalProposePricingComponent, // Remove Me
    CreditProposalCollateralInfoBTPComponent,
    CreditProposalTabCustomerProfitabilityComponent,
    CollateralTypeDialogComponent,
    PartyPostalAddressCardComponent,
    CustomerDetailCardComponent,
    // OrganizationLegalListComponent,
    CreditProposalBankAccountAnalystDialogComponent,
    DeptorDataDocumentChecklistComponent,
    CreditProposalCollateralInfoChecklistComponent,
    DebtorDataSlikSummaryComponent,
    DeborDataSlikSummaryDebiturComponent,
    DebtorDataSlikSummaryDebiturDialogComponent,
    DebtorDataSlikSummaryDebiturViewComponent,
    DebtorDataSlikSummaryShareHolderComponent,
    DebtorDataSlikSummaryShareHolderDialogComponent,
    DebtorDataSlikSummaryComparisonComponent,
    DeborDataSlikIdebComponent,
    LoanAnalysComplianceComponent,
    CreditProposalCollateralTabLoanDialogComponent,
    CreditProposalCollateralTabLoanAfterDialogComponent,

    ParipasuCollateralComponent,
    DebtorDataOrganizationManagementListComponent,
    RetriveComponent,
    CreditProposalFinancialStatementRemarksComponent,
    CreditProposalBookingBranchComponent,
    CreditProposalBranchComponent,
    PartyCifCustomerInfoPostalAddressWarehouseComponent,
    // mapping collateral
    // === Previous === //

    // Loan Facility Detail
    LoanFacilityDetailPreviousComponent,

    // === BELOW === //
    BellowGridPreviousComponent,
    // === ABOVE === //
    AboveGridPreviousComponent,

    //  ==== Previous Covenant Deviation ====  //

    // other Deviation

    // Main Covenant
    BellowGridComponent,
    AboveGridComponent,
    GroupCollateralComponent,
    CollateralPropertyListPersonalPropertyTemplateComponent,
    LoanAnalysOpinionComponent,
    LoanAnalysOpinionCompliancePartComponent,
    LoanAnalysDialogOpinionComponent,
    LoanAnalysDialogOpinionCompliancePartComponent,
    CollateralAppraisalPartyGroupViewComponent,
    CollateralAppraisalPersonViewComponent,
    CreditProposalBankAccountAnalystDialogEditComponent,
    AssignToComponent,
    DebtorDataSlikUploadComponent,

    // === Credit Proposal History === //
    CollateralInfoHistoryComponent,
    // Above
    AboveGridHistoryComponent,
    // Dialog
    CollateralInfoHistoryDialogComponent,
    CollateralInfoDialogBTBHistoryComponent,
    // Below
    BellowGridHistoryComponent,
    // Back to Back
    CollateralInfoBTPHistoryComponent,
    // Checklist
    CollateralInfoChecklistHistoryComponent,
    // Group Collateral
    GroupCollateralHistoryComponent,
    GroupCollateralListHistoryComponent,
    // Paripaasu Collateral
    // ParipasuCollateralHistoryComponent,
    // Remarks
    // CollateralInfoRemarksHistoryComponent,

    // === Loan Facility History === //
    LoanFacilityDetailHistoryComponent,
    // grid
    LoanFacilityDetailGridHistoryComponent,
    // Take over
    LoanFacilityTakeOverHistoryComponent,
    LoanFacilityTakeOverGridHistoryComponent,
    // Take over -> Collateral
    CollateralTabLoanDialogHistoryComponent,
    CollateralTabLoanHistoryComponent,
    // dialog
    CreditProposalLoanFacilityDialogHistoryComponent,
    // mapping
    // MappingCollateralHistoryComponent,
    MappingFacilityHistoryComponent,
    // Take over after
    LoanFacilityTakeOverAfterHistoryComponent,
    LoanFacilityTakeOverAfterGridHistoryComponent,
    // Take over after -> Collateral
    CollateralTabLoanAfterDialogHistoryComponent,
    CollateralTabLoanAfterHistoryComponent,

    PostalAddressJurisdictionCountryComponent,

    // === CONVENAT HISTORY === //
    CreditProposalTabCovenantHistoryComponent,
    // Above
    CreditProposalCovenantAboveHistoryComponent,
    CreditProposalDeviationAboveHistoryComponent,
    // Below
    CreditProposalCovenantBelowHistoryComponent,
    CreditProposalDeviationBelowHistoryComponent,
    // Back to Back
    CovenantBackToBackGeneralHistoryComponent,
    CovenantBackToBackDepositHistoryComponent,
    DeviationBackToBackGeneralHistoryComponent,
    DeviationBackToBackDepositHistoryComponent,
    // Other Covenant
    CreditProposalOtherCovenantHistoryComponent,
    CreditProposalOtherDeviationHistoryComponent,
    // Dialog
    CreditProposalOtherCovenantDialogHistoryComponent,
    CreditProposalOtherCovenantEditHistoryComponent,
    // Repayment Capability
    CreditProposalRepaymentCapabilityComponent,
    CollateralInfoComponent,
    ReportIndependentCollateralComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalDetailProcessLandCertificatesComponent,
    CollateralAppraisalDetailProcessLandComponent,
    DebtorDataViewUploadComponent,
    // CollateralAppraisalNewInfoComponent,
    // TypeDialogAppraisalComponent,
    DarCovenantAboveComponent,
    DarCovenantBackToBackDepositComponent,
    DarCovenantBackToBackGeneralComponent,
    // CollateralAppraisalForwardToComponent,
    AppraisalRoleComponent,
    ProposalBasicInformationViewComponent,
    // FacilityInfoGroupComponent,
    CreditProposalDocumentChecklistHistoryComponent,
    DocumentChecklistDialogHistoryComponent,
    CovenantTempComponent,
    OtherCovenantTempComponent,
    OtherCovenantTempDialogComponent,
    CreditProposalOtherCovenantEditTempComponent,
    CreditProposalCovenantBelowTempComponent,
    CreditProposalDeviationBelowTempComponent,
    DocumentChecklistTempComponent,
    DocumentChecklistDialogTempComponent,
    CreditProposalDeviationDarAboveComponent,
    ApproveFinalComponent,
    DisbursmentApproveComponent,
    CollateralPropertyPersonalCorporateGuaranteeComponent,
    GroupCollateralInfoComponent,
    GroupCollateralListComponent,
    // InsuranceInformationIddComponent,
    // cross cp //
    ParipasuCollateralGroupComponent,
    ParipasuCollateralDebiturComponent,
    GroupCollateralListCpComponent,
    SummaryGridComponent,
    SummaryGridBtbComponent,
    // cross appraisal //
    // GroupCollateralListAppraisalComponent,
    // GroupCollateralAppraisalComponent,
    // cross dar //
    GroupCollateralDarComponent,
    GroupCollateralListDarComponent,
    MainFacilityInfoComponent,
    DebtorInformationComponent,
    MainFacilityHistoryComponent,
    MainFacilityChildHistoryComponent,
    CertificateInfoComponent,
    CreditProposalSummaryGenerateMemoBandingComponent,
    CreditProposalCollateralSummaryDialogComponent,

    // Agreement Compare
    AgremeentCompareRevisionFinalComponent,
    AgreementComparePreviousDarComponent,
    SignerPerjanjialKreditDialogComponent,
    CreditProposalGeneratePkReportComponent,
    OfferingLetterSignerPageComponent,
    OfferingLetterSignerPageDialogComponent,
    ClausalPkDialogComponent,

    // DAR
    LoanFacilityDetailTempComponent,
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
    CollateralInfoDarFinalComponent,
    AboveGridDarFinalComponent,
    BellowGridDarFinalComponent,
    CollateralInfoBTPDarFinalComponent,
    CollateralInfoDialogBTBDarFinalComponent,
    CollateralInfoDialogTempComponent,
    MappingFacilityTempComponent,
    MainFacilityDarComponent,
    MainFacilityChildDarComponent,
    MainFacilityDialogDarComponent,
    InsuranceInfoDialogComponent,
    GridDetailInsuranceComponent,
    InsuranceInfoDialogDetailComponent,
    InsuranceDocumentComponent,
    InsuranceDocumentDialogComponent,
    // DEV
    DeveloperShowDiagramStateMultipleComponent,
    DeveloperShowDiagramStateMultipleDialogComponent,
    ClausalPkDialogComponentEditComponent,
    BindingValueInformationComponent,
    BindingValueInformationGridComponent,
    InternalMemoComponent,
    InternalMemoLoanOperationComponent,
    DialogInternalMemoComponent,
    DialogInternalMemoLoanOperationComponent,

    // generate tbo monitoring
    GenerateTboLegalMonitoringComponent,

    // tbo-legal-monitoring
    TboLegalMonitoringComponent,

    // tbo-monitoring-detail
    TboLegalMonitoringDetailComponent,

    // tbo-monitoring-view
    TboLegalMonitoringViewComponent,

    // history-tbo
    HistoryTBOComponent,

    // Document Legal DPDL
    DocumentLegalUploadComponent,
    DocumentLegalUploadLoanOperationComponent,
    DocumentDpdlUploadDialogComponent,
    DocumentDpdlUploadDialogLoanOperationComponent,
    DocumentDpdlDetailDialogComponent,
    DocumentDpdlDetailDialogLoanOperationComponent,

    DocumentLegalComponent,
    DocumentLegalLoanOperationComponent,
    DocumentLegalDialogComponent,
    DocumentLegalDetailDialogLoanOperationComponent,
    DocumentLegalDetailDialogComponent,
    DpdlDocumentComponent,
    DpdlDocumentLoanOperationComponent,
    GenerateDpdlDraftComponent,
    GenerateDpdlDraftLoanOperationComponent,
    InternalMemoDetailComponent,
    InternalMemoDetailLoanOperationComponent,
    DpdlPreparationComponent,
    DpdlPreparationLoanOperationComponent,
    BindingValueInformationDialogComponent,
    BindingValueRealEstateGridComponent,
    BindingValueRealEstateDialogComponent,
    BindingValueMachineGridComponent,
    BindingValueMachineDialogComponent,
    BindingValueDepositoGridComponent,
    BindingValueDepositoDialogComponent,
    BindingValueGeneralGridComponent,
    BindingValueGeneralDialogComponent,
    // scroll-up
    ScrollComponent,

    // DPPK Preparation
    DppkPreparationComponent,
    BankAccountComponent,
    BankAccountDialogComponent,
    GenerateDraftDppkComponent,
    DppkAssignToComponent,

    DppkPreparationInternalMemoComponent,
    DppkPreparationInternalMemoDialogComponent,
    DppkPreparationInternalMemoDialogDetailComponent,
    CollateralOwnerAddressComponent,
    // Loan Ops Collateral Info
    CollateralInfoLoanOpsComponent,
    AboveGridLoanOpsComponent,
    CollateralInfoBTBLoanOpsComponent,
    DialogCollateralInfoDialogBTBComponent,
    BellowGridLoanOpsComponent,
    BindingValueInformationLoanOpsComponent,
    BindingValueDepositoDialogLoanOpsComponent,
    BindingValueDepositoGridLoanOpsComponent,
    BindingValueGeneralDialogLoanOpsComponent,
    BindingValueGeneralGridLoanOpsComponent,
    BindingValueMachineDialogLoanOpsComponent,
    BindingValueMachineGridLoanOpsComponent,
    BindingValueRealEstateDialogLoanOpsComponent,
    BindingValueRealEstateGridLoanOpsComponent,
    BindingValueInformationDialogLoanOpsComponent,
    BindingValueInformationGridLoanOpsComponent,
    CollateralInfoChecklistLoanOpsComponent,
    CollateralSummaryDialogLoanOpsComponent,
    SummaryGridLoanOpsComponent,
    SummaryGridBtbLoanOpsComponent,
    GroupCollateralListLoanOpsComponent,
    GroupCollateralLoanOpsComponent,
    CollateralInfoRemarksChecklistLoanOpsComponent,
    CollateralInfoRemarksInformationLoanOpsComponent,
    CollateralInfoRemarksLoanOpsComponent,
    MappingFacilityLoanOpsComponent,
    CollateralInfoDialogLoanOpsComponent,
    DocumentChecklistOpinionComponent,
  ],
  /* jhipster-needle-as-list-export-shared-module - JHipster will add entity exports imports here */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedEntityModule {}
