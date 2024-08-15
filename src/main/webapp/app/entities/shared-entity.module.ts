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
import { ProductTypeViewComponent } from './product-type/product-type-view.component';
import { FeatureTypeViewComponent } from './feature-type/feature-type-view.component';
import { FeatureViewComponent } from './feature/feature-view.component';
import { BaseAccountViewComponent } from './base-account/base-account-view.component';
import { AccountTypeViewComponent } from './account-type/account-type-view.component';
import { PeriodViewComponent } from './period/period-view.component';
import { PostalAddressViewComponent } from './postal-address/postal-address-view.component';
import { StateBoundaryViewComponent } from './state-boundary/state-boundary-view.component';
import { PartyRoleViewComponent } from './party-role/party-role-view.component';
import { GeoBoundaryTypeViewComponent } from './geo-boundary-type/geo-boundary-type-view.component';
// import { GeoBoundaryViewComponent } from './geo-boundary/geo-boundary-view.component';
import { PartyCategoryViewComponent } from './party-category/party-category-view.component';
import { PartyCategoryTypeViewComponent } from './party-category-type/party-category-type-view.component';
import { PartyClassificationAsChildComponent } from './party-classification/party-classification-as-child.component';
import { PartyClassificationViewComponent } from './party-classification/party-classification-view.component';
import { ProductCategoryViewComponent } from './product-category/product-category-view.component';
import { ProductCategoryTypeViewComponent } from './product-category-type/product-category-type-view.component';
import { ProductCategoryDialogComponent } from './product-category/product-category-dialog.component';
import { ProductClassificationViewComponent } from './product-classification/product-classification-view.component';
import { PeriodTypeViewComponent } from './period-type/period-type-view.component';
import { WorkTypeViewComponent } from './work-type/work-type-view.component';
import { ContactMechTypeViewComponent } from './contact-mech-type/contact-mech-type-view.component';
import { PurposeTypeViewComponent } from './purpose-type/purpose-type-view.component';
import { ProductConfigViewComponent } from './product-config/product-config-view.component';
import { UomViewComponent } from './uom/uom-view.component';
import { UomTypeViewComponent } from './uom-type/uom-type-view.component';
import { UomConversionViewComponent } from './uom-conversion/uom-conversion-view.component';
import { TaxTypeViewComponent } from './tax-type/tax-type-view.component';
import { FeatureApplicableViewComponent } from './feature-applicable/feature-applicable-view.component';
import { IdentificationTypeViewComponent } from './identification-type/identification-type-view.component';
import { SettlementTypeViewComponent } from './settlement-type/settlement-type-view.component';
import { SettlementViewComponent } from './settlement/settlement-view.component';
import { OrganizationCustomerViewComponent } from './organization-customer/organization-customer-view.component';
import { PersonalCustomerViewComponent } from './personal-customer/personal-customer-view.component';
// import { InternalViewComponent } from './internal/internal-view.component';
import { ParentOrganizationViewComponent } from './parent-organization/parent-organization-view.component';
import { VendorProductViewComponent } from './vendor-product/vendor-product-view.component';
import { PartyPaymentPrefViewComponent } from './party-payment-pref/party-payment-pref-view.component';
import { ServiceProductAsListComponent } from './service-product/service-product-as-list.component';
import { ServiceProductViewComponent } from './service-product/service-product-view.component';
import { FinancialProductAsListComponent } from './financial-product/financial-product-as-list.component';
import { FinancialProductViewComponent } from './financial-product/financial-product-view.component';
import { ProductTypeFinancialSettingViewComponent } from './product-type-financial-setting/product-type-financial-setting-view.component';
import { FuncSettingTemplateViewComponent } from './func-setting-template/func-setting-template-view.component';
import { FuncSettingViewComponent } from './func-setting/func-setting-view.component';
import { ApplicationTypeViewComponent } from './application-type/application-type-view.component';
import { FacilityTypeViewComponent } from './facility-type/facility-type-view.component';
import { FacilityViewComponent } from './facility/facility-view.component';
import { InternalTypeViewComponent } from './internal-type/internal-type-view.component';
import { ProductTypeConfigViewComponent } from './product-type-config/product-type-config-view.component';
import { CifViewComponent } from './cif/cif-view.component';
import { CollateralUpdateComponent } from './collateral/collateral-update.component';
import { CollateralViewComponent } from './collateral/collateral-view.component';
import { CollateralTypeViewComponent } from './collateral-type/collateral-type-view.component';
import { CustomerInfoViewComponent } from './customer-info/customer-info-view.component';
import { CreditRatingViewComponent } from './credit-rating/credit-rating-view.component';
import { EmploymentViewComponent } from './employment/employment-view.component';
import { OrganizationFinancialViewComponent } from './organization-financial/organization-financial-view.component';
import { OrganizationLegalViewComponent } from './organization-legal/organization-legal-view.component';
import { OrganizationManagementViewComponent } from './organization-management/organization-management-view.component';
import { RelationTypeViewComponent } from './relation-type/relation-type-view.component';
import { CreditApplicationViewComponent } from './credit-application/credit-application-view.component';
import { CommEventViewComponent } from './comm-event/comm-event-view.component';
import { CommEventTypeViewComponent } from './comm-event-type/comm-event-type-view.component';
import { PartyIdentificationAsListComponent } from './party-identification/party-identification-as-list.component';
import { PartyIdentificationViewComponent } from './party-identification/party-identification-view.component';
import { StatusItemViewComponent } from './status-item/status-item-view.component';
import { PartySlikAsListComponent } from './party-slik/party-slik-as-list.component';
import { PartySlikViewComponent } from './party-slik/party-slik-view.component';
import { CifViewCustomComponent } from './cif/cif-view-custom.component';
import { CreditFacilityAsListComponent } from './credit-facility/credit-facility-as-list.component';
import { CreditFacilityViewComponent } from './credit-facility/credit-facility-view.component';
import { CollateralAppraisalViewComponent } from './collateral-appraisal/collateral-appraisal-view.component';
import { CollateralAppraisalInfoComponent } from './collateral-appraisal/info/collateral-appraisal-info.component';
import { CollateralAppraisalExternalOfficerComponent } from './collateral-appraisal/external/collateral-appraisal-external-officer.component';
import { CollateralAppraisalDetailProcessMesinComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-mesin.component';
import { CollateralAppraisalNegativeCollateralComponent } from './collateral-appraisal/negative/collateral-appraisal-negative-collateral.component';
import { CollateralAppraisalComparisonComponent } from './collateral-appraisal/comparison/collateral-appraisal-comparison.component';
import { CollateralAppraisalProcessComponent } from './collateral-appraisal/foto/collateral-appraisal-process.component';
import { PartyCifViewComponent } from './party-cif/party-cif-view.component';
import { CollateralPropertyViewComponent } from './collateral-property/collateral-property-view.component';
import { EmployeeViewComponent } from './employee/employee-view.component';
import { EmploymentTypeViewComponent } from './employment-type/employment-type-view.component';
import { PositionViewComponent } from './position/position-view.component';
import { PositionTypeViewComponent } from './position-type/position-type-view.component';
import { PersonEmployeeViewComponent } from './person/person-employee-view.component';
import { SurveyorViewComponent } from './surveyor/surveyor-view.component';
import { PartnerViewComponent } from './partner/partner-view.component';
import { AccountViewComponent } from './account/account-view.component';

import { SurveyBatchViewComponent } from './survey-batch/survey-batch-view.component';
import { ApplicationProductViewComponent } from './application-product/application-product-view.component';
import { BaseApplicationViewComponent } from './base-application/base-application-view.component';
import { DocumentComponent } from './document/document.component';

import { CreditProposalCorrespondenceComponent } from './credit-proposal/correspondence/credit-proposal-correspondence.component';

import { SlikSummaryComponent } from './credit-proposal/slik-summary/slik-summary.component';
import { SlikSummaryDebiturComponent } from './credit-proposal/slik-summary/debitur/slik-summary-debitur.component';
import { SlikSummaryDebiturDialogComponent } from './credit-proposal/slik-summary/debitur/slik-summary-debitur-dialog.component';
import { SlikSummaryShareHolderComponent } from './credit-proposal/slik-summary/share-holder/slik-summary-share-holder.component';
import { SlikSummaryShareHolderDialogComponent } from './credit-proposal/slik-summary/share-holder/slik-summary-share-holder-dialog.component';
import { SlikSummaryBusinessGroupComponent } from './credit-proposal/slik-summary/business-group/slik-summary-business-group.component';
import { SlikSummaryBusinessGroupDialogComponent } from './credit-proposal/slik-summary/business-group/slik-summary-business-group-dialog.component';
import { CreditProposalTabCovenantComponent } from './credit-proposal/convenant/credit-proposal-tab-covenant.component';
import { CreditProposalPersonalInfoComponent } from './credit-proposal/basic-information/personal-info.component';
import { CreditProposalPersonComponent } from './credit-proposal/credit-proposal-person.component';
import { AddCoborowerComponent } from './credit-proposal/basic-information/add-new-coborower.component';
import { CreditProposalTabExposureComponent } from './credit-proposal/exposure/credit-proposal-tab-exposure.component';
import { TotalExposureComponent } from './credit-proposal/exposure/total-exposure/total-exposure.component';
import { LegalLendingComponent } from './credit-proposal/exposure/legal-lending/legal-lending.component';
import { IndustryLimitComponent } from './credit-proposal/exposure/industry-limit/industry-limit.component';
import { CreditProposalTabLoanFacilityDetailGridComponent } from './credit-proposal/loan-facility/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { OrganizationManagementListComponent } from './organization-management/organization-management-list.component';
import { PartyCifCustomerInfoPersonComponent } from './party-cif/customer-info/party-cif-customer-info-person.component';
import { PostalAddressViewCustomComponent } from './postal-address/postal-address-view-custom.component';

import { PositionReportingStructureViewComponent } from './position-reporting-structure/position-reporting-structure-view.component';
import { DocumentTypeViewComponent } from './document-type/document-type-view.component';
import { LendingProgramParameterViewComponent } from './lending-program-parameter/lending-program-parameter-view.component';
import { RequestSlikViewComponent } from './request-slik/request-slik-view.component';
import { SlikSummaryComparisonComponent } from './credit-proposal/slik-summary/comparison-slik/slik-summary-comparison.component';
import { LoanAnalysSlikIdebComponent } from './credit-proposal/slik-summary/ideb/loan-analys-slik-ideb.component';
import { CollateralPropertyListComponent } from './collateral-property/collateral-property-list.component';
import { OrganizationManagementBusinessGroupComponent } from './organization-management/organization-management-business-group.component';
import { CustomerGroupListComponent } from './customer-group/customer-group-list.component';
import { CreditProposalRiskAcceptanceCriteriaBelowComponent } from './credit-proposal/risk-criteria/below/credit-proposal-risk-acceptance-criteria-below-component';
import { CreditProposalAceptanceCriteriaBackToBackComponent } from './credit-proposal/risk-criteria/back-to-back/credit-proposal-risk-acceptance-criteria-back-to-back-component';
import { CreditProposalBankAccountAnalysisComponent } from './credit-proposal/credit-proposal-bank-account-analysis';
import { CreditProposalDocumentChecklistComponent } from './credit-proposal/document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogComponent } from './credit-proposal/document-checklist/document-checklist-dialog.component';
import { CreditProposalRiskAcceptanceCriteriaComponent } from './credit-proposal/risk-criteria/credit-proposal-risk-acceptance-criteria-component';
import { CreditProposalFinancialStatementComponent } from './credit-proposal/financial-statement/credit-proposal-financial-statement.component';
import { CreditProposalBankAccountAnalystComponent } from './credit-proposal/bank-account-analyst/bank-account-analyst.component';
import { CreditProposalCollateralInfoBTPComponent } from './credit-proposal/collateral-info/backtoback/credit-proposal-collateral-info-btb.component';

import { ProposePricingLoanFacilityDetailComponent } from './credit-proposal/propose-pricing/propose-pricing-loan-facility-detail.component';
import { CollateralTypeDialogComponent } from './party-cif/collateral-info/collateral-type-dialog.component';
import { PartyPostalAddressCardComponent } from './party-postal-address/party-postal-address-card.component';
import { CustomerDetailCardComponent } from './customer/customer-detail-card.component';
import { OrganizationLegalListComponent } from './organization-legal/organization-legal-list.component';
import { entityDialogModule } from './entity-dialog.constant';
import { CovenantBackToBackGeneralComponent } from './credit-proposal/convenant/back-to-back/covenant-backtoback-general.component';
import { CovenantBackToBackDepositComponent } from './credit-proposal/convenant/back-to-back/covenant-backtoback-deposit.component';
import { DeviationBackToBackGeneralComponent } from './credit-proposal/convenant/back-to-back/deviation/deviation-backtoback-general.component';
import { DeviationBackToBackDepositComponent } from './credit-proposal/convenant/back-to-back/deviation/deviation-backtoback-deposit.component';
import { CreditProposalCovenantAboveComponent } from './credit-proposal/convenant/above/credit-proposal-covenant-above.component';
import { CreditProposalDeviationAboveComponent } from './credit-proposal/convenant/above/deviation/credit-proposal-deviation-above.component';
import { CreditProposalCovenantBelowComponent } from './credit-proposal/convenant/below/credit-proposal-covenant-below.component';
import { CreditProposalDeviationBelowComponent } from './credit-proposal/convenant/below/deviation/credit-proposal-deviation-below.component';
import { CreditProposalBankAccountAnalystDialogComponent } from './credit-proposal/bank-account-analyst/bank-account-analyst-dialog.component';
import { DeptorDataDocumentChecklistComponent } from './debtor-data/document-checklis/document-checklis-deptor-data.component';
import { DebtorDataDocumentChecklistDialogComponent } from './debtor-data/document-checklis/debtor-data-document-checklis-dialog.component';
import { CreditProposalCollateralInfoChecklistComponent } from './credit-proposal/collateral-info/checklist/credit-proposal-collateral-info-checklist.component';

import { CreditProposalOtherCovenantDialogComponent } from './credit-proposal/convenant/other-covenant/add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditComponent } from './credit-proposal/convenant/other-covenant/edit/credit-proposal-other-covenant-edit.component';
import { CreditProposalOtherCovenantComponent } from './credit-proposal/convenant/other-covenant/credit-proposal-other-covenant.component';
import { DebtorDataSlikSummaryComponent } from './debtor-data/slick-summary/debtor-data-slik-summary.component';
import { DeborDataSlikSummaryDebiturComponent } from './debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur.component';
import { DebtorDataSlikSummaryDebiturDialogComponent } from './debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur-dialog.component';
import { DebtorDataSlikSummaryDebiturViewComponent } from './debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur-view.component';
import { DebtorDataSlikSummaryShareHolderComponent } from './debtor-data/slick-summary/share-holder/slik-summary-share-holder.component';
import { DebtorDataSlikSummaryShareHolderDialogComponent } from './debtor-data/slick-summary/share-holder/slik-summary-share-holder-dialog.component';
import { DebtorDataSlikSummaryComparisonComponent } from './debtor-data/slick-summary/comparison/debtor-data-comparison.component';
import { DeborDataSlikIdebComponent } from './debtor-data/slick-summary/comparison/ideb/debtor-data-ideb.component';
import { CreditProposalRacNilaiPembelianComponent } from './credit-proposal/risk-criteria/nilai-pembelian/credit-proposal-risk-acceptance-criteria-nilai-pembelian';
import { CreditProposalRacNilaiPembelianAddComponent } from './credit-proposal/risk-criteria/nilai-pembelian/credrit-proposal-risk-acceptance-criteria-add';
import { CreditProposalRacNilaiPembelianEditComponent } from './credit-proposal/risk-criteria/nilai-pembelian/credit-proposal-risk-acceptance-criteria-edit';
import { CreditProposalTabLoanFacilityTakeOverGridComponent } from './credit-proposal/loan-facility/take-over/credit-proposal-tab-loan-facility-take-over.grid.component';
import { CreditProposalCollateralTabLoanComponent } from './credit-proposal/loan-facility/take-over/collateral/credit-proposal-collateral-tab-loan.component';
import { CreditProposalCollateralTabLoanDialogComponent } from './credit-proposal/loan-facility/take-over/collateral/credit-proposal-collateral-tab-loan-dialog.component';
import { CreditProposalTabLoanFacilityTakeOverComponent } from './credit-proposal/loan-facility/take-over/credit-proposal-tab-loan-facility-take-over.component';
import { CreditProposalTabLoanFacilityTakeOverAfterGridComponent } from './credit-proposal/loan-facility/take-over-after/credit-proposal-tab-loan-facility-take-over-after.grid.component';
import { CreditProposalCollateralTabLoanAfterComponent } from './credit-proposal/loan-facility/take-over-after/collateral/credit-proposal-collateral-tab-loan-after.component';
import { CreditProposalCollateralTabLoanAfterDialogComponent } from './credit-proposal/loan-facility/take-over-after/collateral/credit-proposal-collateral-tab-loan-after-dialog.component';
import { CreditProposalTabLoanFacilityTakeOverAfterComponent } from './credit-proposal/loan-facility/take-over-after/credit-proposal-tab-loan-facility-take-over-after.component';
import { ParipasuCollateralComponent } from './credit-proposal/collateral-info/paripasu-collateral/paripasu-collateral.component';
import { DebtorDataOrganizationManagementListComponent } from './debtor-data/slick-summary/management-data/debtor-data-organization-management-list.component';
import { LoanFacilityDetailGridPreviousComponent } from './credit-proposal/loan-facility-previous/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { CreditProposalCollateralInfoPreviousComponent } from './credit-proposal/collateral-info-previous/credit-proposal-collateral-info-previous.component';
import { CreditProposalCollateralInfoBTPPreviousComponent } from './credit-proposal/collateral-info-previous/backtoback/credit-proposal-collateral-info-btb-previous.component';
import { CreditProposalDeviationAbovePreviousComponent } from './credit-proposal/convenant-previous/above/deviation/credit-proposal-deviation-above-previous.component';
import { CreditProposalCovenantAbovePreviousComponent } from './credit-proposal/convenant-previous/above/credit-proposal-covenant-above-previous.component';
import { CreditProposalCovenantBelowPreviousComponent } from './credit-proposal/convenant-previous/below/credit-proposal-covenant-below-previous.component';
import { CreditProposalDeviationBelowPreviousComponent } from './credit-proposal/convenant-previous/below/deviation/credit-proposal-deviation-below-previous.component';
import { CovenantBackToBackGeneralPreviousComponent } from './credit-proposal/convenant-previous/back-to-back/covenant-backtoback-general-previous.component';
import { CovenantBackToBackDepositPreviousComponent } from './credit-proposal/convenant-previous/back-to-back/covenant-backtoback-deposit-previous.component';
import { DeviationBackToBackDepositPreviousComponent } from './credit-proposal/convenant-previous/back-to-back/deviation/deviation-backtoback-deposit-previous.component';
import { DeviationBackToBackGeneralPreviousComponent } from './credit-proposal/convenant-previous/back-to-back/deviation/deviation-backtoback-general-previous.component';
import { CreditProposalOtherCovenantPreviousComponent } from './credit-proposal/convenant-previous/other-covenant/credit-proposal-other-covenant-previous.component';
import { CreditProposalTabCovenantPreviousComponent } from './credit-proposal/convenant-previous/credit-proposal-tab-covenant-previous.component';
import { BellowGridComponent } from './credit-proposal/collateral-info/bellow-grid/bellow-grid.component';
import { AboveGridComponent } from './credit-proposal/collateral-info/above-grid/above-grid.component';
import { GroupCollateralComponent } from './credit-proposal/collateral-info/group-collateral/group-collateral.component';
import { CollateralPropertyListPersonalPropertyTemplateComponent } from './collateral-property/templates/collateral-property-list-personal-property-template.component';
import { entityTemplate } from './entity-template.constant';
import { RetriveComponent } from './credit-proposal/retrive/retrive.component';
import { PartyCifCustomerInfoPartyGroupComponent } from './party-cif/customer-info/party-cif-customer-info-party-group.component';
import { CollateralAppraisalPersonViewComponent } from './collateral-appraisal/collateral-appraisal-person-view.component';
import { CollateralAppraisalPartyGroupViewComponent } from './collateral-appraisal/collateral-appraisal-party-group-view.component';
import { CollateralInfoComponent } from './collateral-appraisal/collateral-info.component';
import { AssignToComponent } from './loan-analys/assign-to/assign-to.component';
import { CreditProposalBankAccountAnalystDialogEditComponent } from './credit-proposal/bank-account-analyst/edit/bank-account-analyst-dialog-edit.component';
import { DebtorDataSlikUploadComponent } from './debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-slik-upload.component';
import { CreditProposalOtherDeviationComponent } from './credit-proposal/convenant/other-covenant/credit-proposal-other-deviation.component';
import { AboveGridHistoryComponent } from './credit-proposal/collateral-info-history/above-grid/above-grid.component';
import { CollateralInfoHistoryDialogComponent } from './credit-proposal/collateral-info-history/dialog/credit-proposal-collateral-info-dialog.component';
import { BellowGridHistoryComponent } from './credit-proposal/collateral-info-history/bellow-grid/bellow-grid.component';
import { CollateralInfoBTPHistoryComponent } from './credit-proposal/collateral-info-history/backtoback/credit-proposal-collateral-info-btb.component';
import { CollateralInfoDialogBTBHistoryComponent } from './credit-proposal/collateral-info-history/backtoback/dialog-credit-proposal-collateral-info-btb.component';
import { CollateralInfoChecklistHistoryComponent } from './credit-proposal/collateral-info-history/checklist/credit-proposal-collateral-info-checklist.component';

import { ParipasuCollateralHistoryComponent } from './credit-proposal/collateral-info-history/paripasu-collateral/paripasu-collateral.component';
import { CollateralInfoRemarksHistoryComponent } from './credit-proposal/collateral-info-history/remarks/credit-proposal-collateral-info-remarks.component';
import { LoanFacilityDetailGridHistoryComponent } from './credit-proposal/loan-facility-history/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { LoanFacilityTakeOverGridHistoryComponent } from './credit-proposal/loan-facility-history/take-over/credit-proposal-tab-loan-facility-take-over.grid.component';
import { LoanFacilityTakeOverHistoryComponent } from './credit-proposal/loan-facility-history/take-over/credit-proposal-tab-loan-facility-take-over.component';
import { CollateralTabLoanDialogHistoryComponent } from './credit-proposal/loan-facility-history/take-over/collateral/credit-proposal-collateral-tab-loan-dialog.component';
import { CollateralTabLoanHistoryComponent } from './credit-proposal/loan-facility-history/take-over/collateral/credit-proposal-collateral-tab-loan.component';
import { CreditProposalLoanFacilityDialogHistoryComponent } from './credit-proposal/loan-facility-history/dialog/loan-facility-dialog.component';
import { MappingCollateralHistoryComponent } from './credit-proposal/loan-facility-history/mapping/mapping-collateral.component';
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
import { ProposePricingLoanFacilityDetailDialogComponent } from './credit-proposal/propose-pricing/propose-pricing-loan-facility-detail-dialog.component';
import { CreditProposalBookingBranchComponent } from './credit-proposal/booking-branch/credit-proposal-booking-branch.component';
import { PartyCifCustomerInfoPostalAddressWarehouseComponent } from './party-cif/customer-info/party-cif-customer-info-postal-address-warehouse.component';
import { CreditProposalRepaymentCapabilityComponent } from './credit-proposal/repayment-capability/credit-proposal-repayment-capability.component';
import { TradeCheckingComponent } from './credit-proposal/trade-checking/credit-proposal-trade-checking.component';
import { CreditProposalTradeCheckingBuyersComponent } from './credit-proposal/trade-checking/buyers/credit-proposal-trade-checking-buyers.component';
import { CreditProposalTradeCheckingBuyersDialogComponent } from './credit-proposal/trade-checking/buyers/credit-proposal-trade-checking-buyers-dialog.component';
import { CreditProposalTradeCheckingSupplierComponent } from './credit-proposal/trade-checking/supplier/credit-proposal-trade-checking-supplier.component';
import { CreditProposalTradeCheckingBuyersDialogEditComponent } from './credit-proposal/trade-checking/buyers/edit/credit-proposal-trade-checking-buyers-dialog-edit.component';
import { CreditProposalTradeCheckingSupplierDialogEditComponent } from './credit-proposal/trade-checking/supplier/edit/credit-proposal-trade-checking-supplier-dialog-edit.component';
import { CreditProposalTradeCheckingSupplierDialogComponent } from './credit-proposal/trade-checking/supplier/credit-proposal-trade-checking-supplier-dialog.component';
import { ReportIndependentCollateralComponent } from './collateral-appraisal/report-independent/report-independent-collateral.component';
import { CollateralAppraisalValuationComponent } from './collateral-appraisal/valuation/collateral-appraisal-valuation.component';
import { CollateralAppraisalValuationMachineComponent } from './collateral-appraisal/valuation/details/collateral-appraisal-valuation-machine.component';
import { CollateralAppraisalValuationLandDialogComponent } from './collateral-appraisal/valuation/dialogs/collateral-appraisal-valuation-land-dialog.component';
import { CollateralAppraisalValuationVehicleComponent } from './collateral-appraisal/valuation/details/collateral-appraisal-valuation-vehicle.component';
import { CollateralAppraisalValuationPropertyComponent } from './collateral-appraisal/valuation/details/collateral-appraisal-valuation-property.component';
import { PartyCifCustomerManagementComponent } from './party-cif/customer-info/party-cif-customer-management.component';
import { CollateralAppraisalDetailProcessUnitConditionComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-unit-condition.component';
import { CollateralAppraisalDetailProcessRealEstateComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-real-estate.component';
import { CollateralAppraisalDetailProcessLandComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-land.component';
import { CollateralAppraisalDetailProcessLandCertificatesComponent } from './collateral-appraisal/collateral/collateral-appraisal-process-detail-land-certificates.component';
import { PartyCifCustomerInfoPostalAddressComponent } from './party-cif/customer-info/party-cif-customer-info-postal-address.component';
import { PartyCifCustomerInfoPostalAddressEnCifWhComponent } from './party-cif/customer-info/party-cif-customer-info-postal-address-en-cif-wh.component';
import { DebtorDataViewUploadComponent } from './debtor-data/slick-summary/debitur/debtor-data-silk-upload/debtor-data-view-upload-slik.component';
import { CollateralAppraisalNewInfoComponent } from './collateral-appraisal/addSelect/collateral-appraisal-info.component';
import { TypeDialogAppraisalComponent } from './collateral-appraisal/addSelect/type-dialog-appraisal.component';
import { DarCovenantAboveComponent } from './loan-analys/dar-final/convenant/above/credit-proposal-covenant-above.component';
import { DarCovenantBackToBackDepositComponent } from './loan-analys/dar-final/convenant/back-to-back/covenant-backtoback-deposit.component';
import { DarCovenantBackToBackGeneralComponent } from './loan-analys/dar-final/convenant/back-to-back/covenant-backtoback-general.component';
import { CollateralAppraisalForwardToComponent } from './collateral-appraisal/summary/forward-to/collateral-appraisal-forward-to.component';
import { DialogBorrowerComponent } from './credit-proposal/credit-proposal-dialog-borrower.component';
import { BellowGridPreviousComponent } from './credit-proposal/collateral-info-previous/below-grid/below-grid-previous.component';
import { AboveGridPreviousComponent } from './credit-proposal/collateral-info-previous/above-grid/above-grid-previous.component';
import { LoanFacilityDetailPreviousComponent } from './credit-proposal/loan-facility-previous/loan-facility-detail-previous.component';
import { AppraisalRoleComponent } from './appraisal-role/appraisal-role.component';
import { FacilityInfoGroupComponent } from './debtor-data/facility-info/facility-info-group.component';
import { CreditProposalMappingFacilityComponent } from './credit-proposal/loan-facility/mapping/mapping-facility.component';
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
import { CreditProposalMappingCollateralComponent } from './credit-proposal/loan-facility/mapping/mapping-collateral.component';
import { CollateralPropertyPersonalCorporateGuaranteeComponent } from './collateral-property/dialogs/collateral-property-personal-corporate-guarantee.component';

import { CreditProposalBranchComponent } from './credit-proposal/booking-branch/credit-proposal-branch.component';
import { ProductCategoryEditDialogComponent } from './product-category/product-category-edit-dialog.component';
import { GroupCollateralInfoComponent } from './party-cif/group-collateral-list/group-collateral-info.component';
import { GroupCollateralListComponent } from './party-cif/group-collateral-list/group-collateral-list.component';
import { ParipasuCollateralIddComponent } from './party-cif/paripasu-collateral-idd/paripasu-collateral-idd.component';
import { GroupCollateralListCpComponent } from './credit-proposal/collateral-info/group-collateral/group-collateral-list-cp.component';
import { ParipasuCollateralDebiturComponent } from './credit-proposal/collateral-info/paripasu-collateral-debitur/paripasu-collateral-debitur.component';
import { ParipasuCollateralGroupComponent } from './credit-proposal/collateral-info/paripasu-collateral-group/paripasu-collateral-group.component';
import { SummaryGridComponent } from './credit-proposal/collateral-info/collateral-summary/summary-grid.component';
import { SummaryGridBtbComponent } from './credit-proposal/collateral-info/collateral-summary-btb/summary-grid-btb.component';
import { GroupCollateralListAppraisalComponent } from './collateral-appraisal/groupList/group-collateral-list-appraisal.component';
import { GroupCollateralAppraisalComponent } from './collateral-appraisal/groupList/group-collateral-appraisal.component';
import { MainFacilityInfoComponent } from './debtor-data/facility-info/main-facility-info.component';
import { MainFacilityInfoChildComponent } from './debtor-data/facility-info/main-facility-info-child.component';
import { MainFacilityComponent } from './credit-proposal/loan-facility/main-facility/main-facility.component';
import { MainFacilityChildComponent } from './credit-proposal/loan-facility/main-facility/main-facility-child.component';
import { InsuranceInformationIddComponent } from './party-cif/insurance-information-idd/insurance-information-idd.component';
import { ParipasuCollateralIddDebtorComponent } from './party-cif/paripasu-collateral-idd-debtor/paripasu-collateral-idd-debtor.component';
import { DebtorInformationComponent } from './debtor-information/debtor-information.component';
import { MainFacilityHistoryComponent } from './credit-proposal/loan-facility-history/main-facility/main-facility-history.component';
import { MainFacilityChildHistoryComponent } from './credit-proposal/loan-facility-history/main-facility/main-facility-child-history.component';
import { CertificateInfoComponent } from './offering-letter/certificate-info/certificate-info.component';
import { CpMemoBandingLoanFacilityComponent } from './credit-proposal/memo-banding/memo-banding-loan-facility/cp-memo-banding-loan-facility.component';
import { CpMemoBandingCollateralComponent } from './credit-proposal/memo-banding/memo-banding-collateral/cp-memo-banding-collateral.component';
import { CpMemoBandingCollateralAboveComponent } from './credit-proposal/memo-banding/memo-banding-collateral/above/cp-memo-banding-collateral-above.component';
import { CPMemoBandingStandardCovenantComponent } from './credit-proposal/memo-banding/memo-banding-covenant/cp-memo-banding-standard-covenant.component';
import { CPMemoBandingCovenantAboveComponent } from './credit-proposal/memo-banding/memo-banding-covenant/above/cp-memo-banding-covenant-above.component';
import { CpMemoBandingOtherCovenantComponent } from './credit-proposal/memo-banding/memo-banding-covenant/other-covenant/cp-memo-banding-other-covenant.component';
import { CPMemoBandingCollateralBacktobackComponent } from './credit-proposal/memo-banding/memo-banding-collateral/backtoback/cp-memo-banding-collateral-backtoback.component';
import { CPMemoBandingCovenantBelowComponent } from './credit-proposal/memo-banding/memo-banding-covenant/below/cp-memo-banding-covenant-below.component';
import { CPMemoBandingCovenantBackToBackDepositComponent } from './credit-proposal/memo-banding/memo-banding-covenant/back-to-back/cp-memo-banding-covenant-back-to-back-deposit.component';
import { CPMemoBandingCovenantBackToBackGeneralComponent } from './credit-proposal/memo-banding/memo-banding-covenant/back-to-back/cp-memo-banding-covenant-back-to-back-general.component';
import { GroupCollateralListHistoryComponent } from './credit-proposal/collateral-info-history/group-collateral/group-collateral-list-history.component';
import { GroupCollateralHistoryComponent } from './credit-proposal/collateral-info-history/group-collateral/group-collateral-history.component';
import { GroupCollateralDarComponent } from './loan-analys/dar-final/collateral-info/group-collateral/group-collateral-dar.component';
import { GroupCollateralListDarComponent } from './loan-analys/dar-final/collateral-info/group-collateral/group-collateral-list-dar.component';
import { CreditProposalSummaryGenerateMemoBandingComponent } from './credit-proposal/credit-proposal-summary-generate-memo-banding.component';
import { CreditProposalCollateralSummaryDialogComponent } from './credit-proposal/collateral-info/collateral-summary/credit-proposal-collateral-summary-dialog.component';
import { SignerPerjanjialKreditDialogComponent } from './credit-agreement/finalize-credit-agreement/signer-perjanjian-kredit-dialog/signer-perjanjian-kredit-dialog.component';
import { CreditProposalGeneratePkReportComponent } from './credit-proposal/generate-document-pk-report/credit-proposal-generate-pk-report.component';
import { StandartConvenantComponent } from './loan-analys/dar-final/convenant/other-covenant/standart-convenant/standart-convenant.component';
import { StandartDeviationComponent } from './loan-analys/dar-final/convenant/other-covenant/standart-deviation/standart-deviation.component';
// import { LoanAfterDialogComponent } from './loan-analys/dar-final/loan-facility/take-over-after/collateral/loan-collateral-tab-loan-after-dialog.component';
import { OfferingLetterSignerPageComponent } from './offering-letter/offering-page/signer/signer-page.component';
import { OfferingLetterSignerPageDialogComponent } from './offering-letter/offering-page/signer/dialog/signer-page-dialog.component';
import { AboveGridDarFinalComponent } from './loan-analys/dar-final/collateral-info/above-grid/above-grid.component';
import { CollateralInfoBTPDarFinalComponent } from './loan-analys/dar-final/collateral-info/backtoback/credit-proposal-collateral-info-btb.component';
import { CollateralInfoDialogBTBDarFinalComponent } from './loan-analys/dar-final/collateral-info/backtoback/dialog-credit-proposal-collateral-info-btb.component';
import { BellowGridDarFinalComponent } from './loan-analys/dar-final/collateral-info/bellow-grid/bellow-grid.component';
import { CollateralInfoDarFinalComponent } from './loan-analys/dar-final/collateral-info/credit-proposal-collateral-info.component';
import { CollateralInfoDialogTempComponent } from './loan-analys/dar-final/collateral-info/dialog/collateral-info-dialog-temp.component';
import { LoanFacilityDialogTempComponent } from './loan-analys/dar-final/loan-facility/dialog/loan-facility-dialog.component';
import { LoanFacilityDetailGridTempComponent } from './loan-analys/dar-final/loan-facility/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { MainFacilityChildDarComponent } from './loan-analys/dar-final/loan-facility/main-facility/main-facility-child-dar.component';
import { MainFacilityDarComponent } from './loan-analys/dar-final/loan-facility/main-facility/main-facility-dar.component';
import { MainFacilityDialogDarComponent } from './loan-analys/dar-final/loan-facility/main-facility/main-facility-dialog-dar.component';
import { CreditProposalMappingCollateralTempComponent } from './loan-analys/dar-final/loan-facility/mapping/mapping-collateral.component';
import { MappingFacilityTempComponent } from './loan-analys/dar-final/loan-facility/mapping/mapping-facility.component';
import { DeveloperShowDiagramStateMultipleComponent } from 'app/developer/reuseable/diagram-state-multiple.component';
import { DeveloperShowDiagramStateMultipleDialogComponent } from 'app/developer/reuseable/dialog/diagram-state-multiple-dialog.component';
import { CompareDataNotFoundComponent } from './compare-data/compare-data.component';
import { CompareDataLoanFacilityComponent } from './compare-data/loan-facility/compare-data-loan-facility.component';
import { CompareDataLoanFacilityGridComponent } from './compare-data/loan-facility/grid/compare-data-loan-facility-grid.component';
import { CompareDataLoanFacilityDialogComponent } from './compare-data/loan-facility/dialog/compare-data-loan-facility-dialog.component';
import { CompareDataCovenantComponent } from './compare-data/covenant/compare-data-covenant.component';
import { CompareDataCovenantGridComponent } from './compare-data/covenant/grid/compare-data-covenant-grid.component';
import { CompareDataCovenantOtherComponent } from './compare-data/covenant/other/compare-data-covenant-other.component';
import { CompareDataCovenantOtherDialogComponent } from './compare-data/covenant/other/dialog/compare-data-covenant-other-dialog.component';
import { LoanPurposeComponent } from './loan-purpose/loan-purpose.component';
import { MemoBandingCollateralAboveBeforeComponent } from './credit-proposal/memo-banding/memo-banding-collateral/above/cp-memo-banding-collateral-above-before.component';
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
import { MemoBandingCollateralBackToBackBeforeComponent } from './credit-proposal/memo-banding/memo-banding-collateral/backtoback/cp-memo-banding-collateral-backtoback-before.component';
import { ClausalPkDialogComponent } from './credit-agreement/finalize-credit-agreement/clausal-pk-dialog/clausal-pk-dialog.component';
import { InsuranceInfoDialogComponent } from './insurance-information/dialog/insurance-info-dialog.component';
import { GridDetailInsuranceComponent } from './insurance-information/grid-detail-insurance.component';
import { insuranceInformationComponent } from './insurance-information/insurance-information.component';
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
import { GeneratePKDraftComponent } from './credit-agreement/finalize-credit-agreement/generate-pk-draft/generate-pk-draft.component';
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
import { MappingFacilityLoanOpsComponent } from './loan-operation/collateral-info/mapping/mapping-facility-loan-ops.component';
import { creditProposalLoanFacilityTemplate } from './credit-proposal/loan-facility/credit-proposal-loan-facility-template.contstants';
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
    ...creditProposalLoanFacilityTemplate,
    PartyCifCustomerInfoPostalAddressComponent,
    PartyCifCustomerInfoPostalAddressEnCifWhComponent,
    PartyCifCustomerInfoPartyGroupComponent,
    PartyCifCustomerInfoPersonComponent,
    PartyCifCustomerManagementComponent,
    OrganizationManagementListComponent,
    PersonEmployeeViewComponent,
    CollateralUpdateComponent,
    PartyViewComponent,
    PersonViewComponent,
    PartyGroupViewComponent,
    PartyTypeViewComponent,
    ProductViewComponent,
    ProductTypeViewComponent,
    FeatureTypeViewComponent,
    FeatureViewComponent,
    BaseAccountViewComponent,
    AccountTypeViewComponent,
    PeriodViewComponent,
    PostalAddressViewComponent,
    StateBoundaryViewComponent,
    PartyRoleViewComponent,
    GeoBoundaryTypeViewComponent,
    // GeoBoundaryViewComponent,
    PartyCategoryViewComponent,
    PartyCategoryTypeViewComponent,
    PartyClassificationAsChildComponent,
    PartyClassificationViewComponent,
    ProductCategoryViewComponent,
    ProductCategoryTypeViewComponent,
    ProductCategoryDialogComponent,
    ProductCategoryEditDialogComponent,
    ProductClassificationViewComponent,
    PeriodTypeViewComponent,
    WorkTypeViewComponent,
    ContactMechTypeViewComponent,
    PurposeTypeViewComponent,
    ProductConfigViewComponent,
    UomViewComponent,
    UomTypeViewComponent,
    UomConversionViewComponent,
    TaxTypeViewComponent,
    FeatureApplicableViewComponent,
    IdentificationTypeViewComponent,
    SettlementTypeViewComponent,
    SettlementViewComponent,
    OrganizationCustomerViewComponent,
    PersonalCustomerViewComponent,
    // InternalViewComponent,
    ParentOrganizationViewComponent,
    VendorProductViewComponent,
    PartyPaymentPrefViewComponent,
    ServiceProductAsListComponent,
    ServiceProductViewComponent,
    FinancialProductAsListComponent,
    FinancialProductViewComponent,
    ProductTypeFinancialSettingViewComponent,
    FuncSettingTemplateViewComponent,
    FuncSettingViewComponent,
    ApplicationTypeViewComponent,
    FacilityTypeViewComponent,
    FacilityViewComponent,
    InternalTypeViewComponent,
    ProductTypeConfigViewComponent,
    CifViewComponent,
    CollateralViewComponent,
    CollateralTypeViewComponent,
    CustomerInfoViewComponent,
    CreditRatingViewComponent,
    EmploymentViewComponent,
    OrganizationFinancialViewComponent,
    OrganizationLegalViewComponent,
    OrganizationManagementViewComponent,
    RelationTypeViewComponent,
    CreditApplicationViewComponent,
    CommEventViewComponent,
    CommEventTypeViewComponent,
    PartyIdentificationAsListComponent,
    PartyIdentificationViewComponent,
    StatusItemViewComponent,
    PartySlikAsListComponent,
    PartySlikViewComponent,
    CreditFacilityAsListComponent,
    CreditFacilityViewComponent,
    CifViewCustomComponent,
    CollateralAppraisalViewComponent,
    SurveyBatchViewComponent,
    CollateralAppraisalInfoComponent,
    CollateralAppraisalExternalOfficerComponent,
    CollateralAppraisalDetailProcessMesinComponent,
    CollateralAppraisalNegativeCollateralComponent,
    CollateralAppraisalComparisonComponent,
    CollateralAppraisalProcessComponent,
    PartyCifViewComponent,
    CollateralPropertyViewComponent,
    EmployeeViewComponent,
    EmploymentTypeViewComponent,
    PositionViewComponent,
    PositionTypeViewComponent,
    SurveyorViewComponent,
    PartnerViewComponent,
    AccountViewComponent,
    ApplicationProductViewComponent,
    BaseApplicationViewComponent,
    DocumentComponent,
    CreditProposalTabLoanFacilityDetailGridComponent,
    CreditProposalCorrespondenceComponent,
    SlikSummaryComponent,
    SlikSummaryDebiturComponent,
    SlikSummaryDebiturDialogComponent,
    SlikSummaryShareHolderComponent,
    SlikSummaryShareHolderDialogComponent,
    SlikSummaryBusinessGroupComponent,
    SlikSummaryBusinessGroupDialogComponent,
    SlikSummaryComparisonComponent,
    LoanAnalysSlikIdebComponent,
    CreditProposalTabCovenantComponent,
    CreditProposalPersonalInfoComponent,
    CreditProposalPersonComponent,
    AddCoborowerComponent,
    TotalExposureComponent,
    LegalLendingComponent,
    IndustryLimitComponent,
    PostalAddressViewCustomComponent,
    CreditProposalTabExposureComponent,
    CollateralPropertyListComponent,
    CustomerGroupListComponent,
    CreditProposalRiskAcceptanceCriteriaBelowComponent,
    CreditProposalAceptanceCriteriaBackToBackComponent,
    CreditProposalBankAccountAnalysisComponent,
    CreditProposalDocumentChecklistComponent,
    DocumentChecklistDialogComponent,
    LoaderBAComponent,
    CreditProposalRiskAcceptanceCriteriaComponent,
    CreditProposalFinancialStatementComponent,
    CreditProposalBankAccountAnalystComponent,
    DeptorDataDocumentChecklistComponent,
    ProposePricingLoanFacilityDetailComponent,
    CreditProposalCollateralInfoBTPComponent,
    CollateralTypeDialogComponent,
    OrganizationManagementBusinessGroupComponent,
    PartyPostalAddressCardComponent,
    CustomerDetailCardComponent,
    OrganizationLegalListComponent,
    CovenantBackToBackGeneralComponent,
    CovenantBackToBackDepositComponent,
    DeviationBackToBackGeneralComponent,
    DeviationBackToBackDepositComponent,
    CreditProposalCovenantAboveComponent,
    CreditProposalDeviationAboveComponent,
    CreditProposalCovenantBelowComponent,
    CreditProposalDeviationBelowComponent,
    CreditProposalBankAccountAnalystDialogComponent,
    DebtorDataDocumentChecklistDialogComponent,
    CreditProposalCollateralInfoChecklistComponent,
    CreditProposalOtherCovenantDialogComponent,
    CreditProposalOtherCovenantEditComponent,
    CreditProposalOtherCovenantComponent,
    DebtorDataSlikSummaryComponent,
    DeborDataSlikSummaryDebiturComponent,
    DebtorDataSlikSummaryDebiturDialogComponent,
    DebtorDataSlikSummaryDebiturViewComponent,
    DebtorDataSlikSummaryShareHolderComponent,
    DebtorDataSlikSummaryShareHolderDialogComponent,
    DebtorDataSlikSummaryComparisonComponent,
    DeborDataSlikIdebComponent,
    CreditProposalRacNilaiPembelianComponent,
    CreditProposalRacNilaiPembelianAddComponent,
    CreditProposalRacNilaiPembelianEditComponent,
    CreditProposalTabLoanFacilityTakeOverGridComponent,
    CreditProposalCollateralTabLoanComponent,
    CreditProposalCollateralTabLoanDialogComponent,
    CreditProposalTabLoanFacilityTakeOverComponent,
    CreditProposalTabLoanFacilityTakeOverAfterGridComponent,
    CreditProposalCollateralTabLoanAfterComponent,
    CreditProposalCollateralTabLoanAfterDialogComponent,
    CreditProposalTabLoanFacilityTakeOverAfterComponent,
    ParipasuCollateralComponent,
    DebtorDataOrganizationManagementListComponent,
    RetriveComponent,
    CreditProposalBankAccountAnalystDialogEditComponent,
    CreditProposalBookingBranchComponent,
    CreditProposalBranchComponent,
    PartyCifCustomerInfoPostalAddressWarehouseComponent,
    CreditProposalMappingFacilityComponent,
    // mapping collateral
    CreditProposalMappingCollateralComponent,


    // === Previous === //

    // Loan Facility Detail
    LoanFacilityDetailPreviousComponent,
    LoanFacilityDetailGridPreviousComponent,

    // Collateral Info
    CreditProposalCollateralInfoPreviousComponent,
    CreditProposalCollateralInfoBTPPreviousComponent,

    // === BELOW === //
    BellowGridPreviousComponent,
    // === ABOVE === //
    AboveGridPreviousComponent,

    //  ==== Previous Covenant Deviation ====  //

    // Above
    CreditProposalDeviationAbovePreviousComponent,
    CreditProposalCovenantAbovePreviousComponent,

    // Below
    CreditProposalCovenantBelowPreviousComponent,
    CreditProposalDeviationBelowPreviousComponent,

    // Back to Back
    CovenantBackToBackGeneralPreviousComponent,
    CovenantBackToBackDepositPreviousComponent,
    DeviationBackToBackDepositPreviousComponent,
    DeviationBackToBackGeneralPreviousComponent,

    // Other Covenant
    CreditProposalOtherCovenantPreviousComponent,

    // Other Deviation
    CreditProposalOtherDeviationComponent,

    // Main Covenant
    CreditProposalTabCovenantPreviousComponent,
    BellowGridComponent,
    AboveGridComponent,
    GroupCollateralComponent,
    CollateralPropertyListPersonalPropertyTemplateComponent,
    CollateralAppraisalPersonViewComponent,
    CollateralAppraisalPartyGroupViewComponent,
    AssignToComponent,
    PositionReportingStructureViewComponent,
    DocumentTypeViewComponent,
    LendingProgramParameterViewComponent,
    RequestSlikViewComponent,
    /* jhipster-needle-declaration-entity-as-list */
    DebtorDataSlikUploadComponent,

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
    ParipasuCollateralHistoryComponent,
    // Remarks
    CollateralInfoRemarksHistoryComponent,

    // === Loan Facility History === //
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
    MappingCollateralHistoryComponent,
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
    ProposePricingLoanFacilityDetailDialogComponent,
    // Repayment Capability
    CreditProposalRepaymentCapabilityComponent,
    // Trade Checking
    TradeCheckingComponent,
    CreditProposalTradeCheckingBuyersComponent,
    CreditProposalTradeCheckingBuyersDialogComponent,
    CreditProposalTradeCheckingBuyersDialogEditComponent,
    CreditProposalTradeCheckingSupplierComponent,
    CreditProposalTradeCheckingSupplierDialogComponent,
    CreditProposalTradeCheckingSupplierDialogEditComponent,
    CollateralInfoComponent,
    ReportIndependentCollateralComponent,
    CollateralAppraisalValuationComponent,
    CollateralAppraisalValuationMachineComponent,
    CollateralAppraisalValuationLandDialogComponent,
    CollateralAppraisalValuationVehicleComponent,
    CollateralAppraisalValuationPropertyComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalDetailProcessLandCertificatesComponent,
    CollateralAppraisalDetailProcessLandComponent,
    DebtorDataViewUploadComponent,
    CollateralAppraisalNewInfoComponent,
    TypeDialogAppraisalComponent,
    DarCovenantAboveComponent,
    DarCovenantBackToBackDepositComponent,
    DarCovenantBackToBackGeneralComponent,
    CollateralAppraisalForwardToComponent,
    DialogBorrowerComponent,
    AppraisalRoleComponent,
    FacilityInfoGroupComponent,
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
    // cross idd //
    ParipasuCollateralIddDebtorComponent,
    ParipasuCollateralIddComponent,

    GroupCollateralInfoComponent,
    GroupCollateralListComponent,
    // cross cp //
    ParipasuCollateralGroupComponent,
    ParipasuCollateralDebiturComponent,
    GroupCollateralListCpComponent,
    SummaryGridComponent,
    InsuranceInformationIddComponent,

    // cross appraisal //
    GroupCollateralListAppraisalComponent,
    GroupCollateralAppraisalComponent,
    SummaryGridBtbComponent,

    // cross dar //
    GroupCollateralDarComponent,
    GroupCollateralListDarComponent,
    MainFacilityInfoComponent,
    MainFacilityInfoChildComponent,
    MainFacilityComponent,
    MainFacilityChildComponent,
    DebtorInformationComponent,
    MainFacilityHistoryComponent,
    MainFacilityChildHistoryComponent,
    CertificateInfoComponent,
    CpMemoBandingLoanFacilityComponent,
    CpMemoBandingCollateralComponent,
    CpMemoBandingCollateralAboveComponent,
    CPMemoBandingStandardCovenantComponent,
    CPMemoBandingCovenantAboveComponent,
    CPMemoBandingCovenantBelowComponent,
    CPMemoBandingCovenantBackToBackDepositComponent,
    CPMemoBandingCovenantBackToBackGeneralComponent,
    CpMemoBandingOtherCovenantComponent,
    CPMemoBandingCollateralBacktobackComponent,
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
    SignerPerjanjialKreditDialogComponent,
    CreditProposalGeneratePkReportComponent,
    StandartConvenantComponent,
    StandartDeviationComponent,
    OfferingLetterSignerPageComponent,
    OfferingLetterSignerPageDialogComponent,
    ClausalPkDialogComponent,


// DAR
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
    CreditProposalMappingCollateralTempComponent,
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
    insuranceInformationComponent,
    InsuranceInfoDialogComponent,
    GridDetailInsuranceComponent,
    InsuranceInfoDialogDetailComponent,
    InsuranceDocumentComponent,
    InsuranceDocumentDialogComponent,
    // DEV
    DeveloperShowDiagramStateMultipleComponent,
    DeveloperShowDiagramStateMultipleDialogComponent,

    //   New Compare Data
    CompareDataNotFoundComponent,
    CompareDataLoanFacilityComponent,
    CompareDataLoanFacilityGridComponent,
    CompareDataLoanFacilityDialogComponent,
    CompareDataCovenantComponent,
    CompareDataCovenantGridComponent,
    CompareDataCovenantOtherComponent,
    CompareDataCovenantOtherDialogComponent,

    LoanPurposeComponent,

    // Memo Banding Collateral
    MemoBandingCollateralAboveBeforeComponent,
    MemoBandingCollateralBackToBackBeforeComponent,

    // pipes memo banding collateral
    CountMVOriginalPipe,
    GetCurrencyPipe,
    CountMVPipe,
    CustomPercentagePipe,
    CountLVPipe,
    CountKjjpMvPipe,
    CountKjjpLvPipe,
    GetMarketabilityPipe,
    GetOwnershipPipe,
    GetExpiryPipe,
    GetBindingTypePipe,
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

    // Generate PK Draft
    GeneratePKDraftComponent,

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
    MappingFacilityLoanOpsComponent,
    CollateralInfoDialogLoanOpsComponent,
    ...LoanOperationLoanFacilityTemplate,
	DocumentChecklistOpinionComponent
  ],
  exports: [
    ...entityDialogModule,
    ...entityTemplate,
    ...LoanOperationLoanFacilityTemplate,
    ...creditProposalLoanFacilityTemplate,
    ...entityDppkFinalizeTemplate,
    LoanPurposeComponent,

    // Memo Banding Collateral
    MemoBandingCollateralAboveBeforeComponent,
    MemoBandingCollateralBackToBackBeforeComponent,

    // pipes memo banding collateral
    CountMVOriginalPipe,
    GetCurrencyPipe,
    CountMVPipe,
    CustomPercentagePipe,
    CountLVPipe,
    CountKjjpMvPipe,
    CountKjjpLvPipe,
    GetMarketabilityPipe,
    GetOwnershipPipe,
    GetExpiryPipe,
    GetBindingTypePipe,

    //   New Compare Data
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
    OrganizationManagementListComponent,
    DocumentComponent,
    PersonEmployeeViewComponent, // Remove Me
    CollateralUpdateComponent, // Remove Me
    PartyViewComponent, // Remove Me
    PersonViewComponent, // Remove Me
    PartyGroupViewComponent, // Remove Me
    PartyTypeViewComponent, // Remove Me
    ProductViewComponent, // Remove Me
    ProductTypeViewComponent, // Remove Me
    FeatureTypeViewComponent, // Remove Me
    FeatureViewComponent, // Remove Me
    BaseAccountViewComponent, // Remove Me
    AccountTypeViewComponent, // Remove Me
    PeriodViewComponent, // Remove Me
    PostalAddressViewComponent, // Remove Me
    StateBoundaryViewComponent, // Remove Me
    PartyRoleViewComponent, // Remove Me
    GeoBoundaryTypeViewComponent, // Remove Me
    // GeoBoundaryViewComponent, // Remove Me
    PartyCategoryViewComponent, // Remove Me
    PartyCategoryTypeViewComponent, // Remove Me
    PartyClassificationAsChildComponent, // Remove Me
    PartyClassificationViewComponent, // Remove Me
    ProductCategoryViewComponent, // Remove Me
    ProductCategoryTypeViewComponent, // Remove Me
    ProductClassificationViewComponent, // Remove Me
    PeriodTypeViewComponent, // Remove Me
    WorkTypeViewComponent, // Remove Me
    ContactMechTypeViewComponent, // Remove Me
    PurposeTypeViewComponent, // Remove Me
    ProductConfigViewComponent, // Remove Me
    UomViewComponent, // Remove Me
    UomTypeViewComponent, // Remove Me
    UomConversionViewComponent, // Remove Me
    TaxTypeViewComponent, // Remove Me
    FeatureApplicableViewComponent, // Remove Me
    IdentificationTypeViewComponent, // Remove Me
    SettlementTypeViewComponent, // Remove Me
    SettlementViewComponent, // Remove Me
    OrganizationCustomerViewComponent, // Remove Me
    PersonalCustomerViewComponent, // Remove Me
    // InternalViewComponent, // Remove Me
    ParentOrganizationViewComponent, // Remove Me
    VendorProductViewComponent, // Remove Me
    PartyPaymentPrefViewComponent, // Remove Me
    ServiceProductAsListComponent, // Remove Me
    ServiceProductViewComponent, // Remove Me
    FinancialProductAsListComponent, // Remove Me
    FinancialProductViewComponent, // Remove Me
    ProductTypeFinancialSettingViewComponent, // Remove Me
    FuncSettingTemplateViewComponent, // Remove Me
    FuncSettingViewComponent, // Remove Me
    ApplicationTypeViewComponent, // Remove Me
    FacilityTypeViewComponent, // Remove Me
    FacilityViewComponent, // Remove Me
    InternalTypeViewComponent, // Remove Me
    ProductTypeConfigViewComponent, // Remove Me
    CifViewComponent, // Remove Me
    CollateralViewComponent, // Remove Me
    CollateralTypeViewComponent, // Remove Me
    CustomerInfoViewComponent, // Remove Me
    CreditRatingViewComponent, // Remove Me
    EmploymentViewComponent, // Remove Me
    OrganizationFinancialViewComponent, // Remove Me
    OrganizationLegalViewComponent, // Remove Me
    OrganizationManagementViewComponent, // Remove Me
    RelationTypeViewComponent, // Remove Me
    CreditApplicationViewComponent, // Remove Me
    CommEventViewComponent, // Remove Me
    CommEventTypeViewComponent, // Remove Me
    PartyIdentificationAsListComponent, // Remove Me
    PartyIdentificationViewComponent, // Remove Me
    StatusItemViewComponent, // Remove Me
    PartySlikAsListComponent, // Remove Me
    PartySlikViewComponent, // Remove Me
    CreditFacilityAsListComponent, // Remove Me
    CreditFacilityViewComponent, // Remove Me
    CifViewCustomComponent, // Remove Me
    CollateralAppraisalViewComponent, // Remove Me
    CollateralAppraisalInfoComponent, // Remove Me
    CollateralAppraisalExternalOfficerComponent, // Remove Me
    CollateralAppraisalDetailProcessMesinComponent, // Remove Me
    CollateralAppraisalNegativeCollateralComponent, // Remove Me
    CollateralAppraisalComparisonComponent, // Remove Me
    CollateralAppraisalProcessComponent, // Remove Me
    PartyCifViewComponent, // Remove Me
    CollateralPropertyViewComponent, // Remove Me
    EmployeeViewComponent, // Remove Me
    EmploymentTypeViewComponent, // Remove Me
    PositionViewComponent, // Remove Me
    PositionTypeViewComponent, // Remove Me
    SurveyorViewComponent, // Remove Me
    PartnerViewComponent, // Remove Me
    AccountViewComponent, // Remove Me
    ApplicationProductViewComponent, // Remove Me
    BaseApplicationViewComponent, // Remove Me
    CreditProposalCorrespondenceComponent, // Remove Me
    CreditProposalTabLoanFacilityDetailGridComponent, // Remove Me
    SlikSummaryComponent, // Remove Me
    SlikSummaryDebiturComponent, // Remove Me
    SlikSummaryDebiturDialogComponent, // Remove Me
    SlikSummaryShareHolderComponent, // Remove Me
    SlikSummaryShareHolderDialogComponent, // Remove Me
    SlikSummaryBusinessGroupComponent, // Remove Me
    SlikSummaryComparisonComponent, // Remove Me
    LoanAnalysSlikIdebComponent, // Remove Me
    CreditProposalPersonalInfoComponent, // Remove Me
    CreditProposalPersonComponent, // Remove Me
    SlikSummaryBusinessGroupDialogComponent, // Remove Me
    CreditProposalTabCovenantComponent, // Remove Me
    AddCoborowerComponent, // Remove Me
    CreditProposalTabExposureComponent, // Remove Me
    TotalExposureComponent, // Remove Me
    LegalLendingComponent, // Remove Me
    IndustryLimitComponent, // Remove Me
    PostalAddressViewCustomComponent, // Remove Me
    SurveyBatchViewComponent, // Remove Me
    CollateralPropertyListComponent,
    OrganizationManagementBusinessGroupComponent,
    CustomerGroupListComponent,
    CreditProposalRiskAcceptanceCriteriaBelowComponent, // Remove Me
    CreditProposalAceptanceCriteriaBackToBackComponent, // Remove Me
    CreditProposalBankAccountAnalysisComponent, // Remove Me
    CreditProposalDocumentChecklistComponent, // Remove Me
    DocumentChecklistDialogComponent, // Remove Me
    LoaderBAComponent,
    CreditProposalRiskAcceptanceCriteriaComponent, // Remove Me
    CreditProposalFinancialStatementComponent, // Remove Me
    CreditProposalBankAccountAnalystComponent, // Remove Me
    ProposePricingLoanFacilityDetailComponent,
    CreditProposalCollateralInfoBTPComponent,
    CollateralTypeDialogComponent,
    PartyPostalAddressCardComponent,
    CustomerDetailCardComponent,
    OrganizationLegalListComponent,
    CovenantBackToBackGeneralComponent,
    CovenantBackToBackDepositComponent,
    DeviationBackToBackDepositComponent,
    DeviationBackToBackGeneralComponent,
    CreditProposalCovenantAboveComponent,
    CreditProposalDeviationAboveComponent,
    CreditProposalCovenantBelowComponent,
    CreditProposalDeviationBelowComponent,
    CreditProposalBankAccountAnalystDialogComponent,
    DeptorDataDocumentChecklistComponent,
    CreditProposalCollateralInfoChecklistComponent,
    CreditProposalOtherCovenantDialogComponent,
    CreditProposalOtherCovenantEditComponent,
    CreditProposalOtherCovenantComponent,
    DebtorDataSlikSummaryComponent,
    DeborDataSlikSummaryDebiturComponent,
    DebtorDataSlikSummaryDebiturDialogComponent,
    DebtorDataSlikSummaryDebiturViewComponent,
    DebtorDataSlikSummaryShareHolderComponent,
    DebtorDataSlikSummaryShareHolderDialogComponent,
    DebtorDataSlikSummaryComparisonComponent,
    DeborDataSlikIdebComponent,
    CreditProposalRacNilaiPembelianComponent,
    CreditProposalRacNilaiPembelianAddComponent,
    CreditProposalRacNilaiPembelianEditComponent,
    CreditProposalTabLoanFacilityTakeOverGridComponent,
    CreditProposalCollateralTabLoanComponent,
    CreditProposalCollateralTabLoanDialogComponent,
    CreditProposalTabLoanFacilityTakeOverComponent,
    CreditProposalTabLoanFacilityTakeOverAfterGridComponent,
    CreditProposalCollateralTabLoanAfterComponent,
    CreditProposalCollateralTabLoanAfterDialogComponent,
    CreditProposalTabLoanFacilityTakeOverAfterComponent,
    ParipasuCollateralComponent,
    DebtorDataOrganizationManagementListComponent,
    RetriveComponent,
    CreditProposalBookingBranchComponent,
    CreditProposalBranchComponent,
    PartyCifCustomerInfoPostalAddressWarehouseComponent,
    CreditProposalMappingFacilityComponent,
    // mapping collateral
    CreditProposalMappingCollateralComponent,
    // === Previous === //

    // Loan Facility Detail
    LoanFacilityDetailPreviousComponent,
    LoanFacilityDetailGridPreviousComponent,

    // Collateral Info
    CreditProposalCollateralInfoPreviousComponent,
    CreditProposalCollateralInfoBTPPreviousComponent,

    // === BELOW === //
    BellowGridPreviousComponent,
    // === ABOVE === //
    AboveGridPreviousComponent,

    //  ==== Previous Covenant Deviation ====  //

    // Above
    CreditProposalDeviationAbovePreviousComponent,
    CreditProposalCovenantAbovePreviousComponent,

    // Below
    CreditProposalCovenantBelowPreviousComponent,
    CreditProposalDeviationBelowPreviousComponent,

    // Back to Back
    CovenantBackToBackGeneralPreviousComponent,
    CovenantBackToBackDepositPreviousComponent,
    DeviationBackToBackDepositPreviousComponent,
    DeviationBackToBackGeneralPreviousComponent,

    // Other Covenant
    CreditProposalOtherCovenantPreviousComponent,

    // other Deviation
    CreditProposalOtherDeviationComponent,

    // Main Covenant
    CreditProposalTabCovenantPreviousComponent,
    BellowGridComponent,
    AboveGridComponent,
    GroupCollateralComponent,
    CollateralPropertyListPersonalPropertyTemplateComponent,
    CollateralAppraisalPartyGroupViewComponent,
    CollateralAppraisalPersonViewComponent,
    CreditProposalBankAccountAnalystDialogEditComponent,
    AssignToComponent,
    DebtorDataSlikUploadComponent,
    PositionReportingStructureViewComponent, // Remove Me

    // === Credit Proposal History === //
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
    ParipasuCollateralHistoryComponent,
    // Remarks
    CollateralInfoRemarksHistoryComponent,

    // === Loan Facility History === //
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
    MappingCollateralHistoryComponent,
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
    ProposePricingLoanFacilityDetailDialogComponent,
    // Repayment Capability
    CreditProposalRepaymentCapabilityComponent,
    // Trade Checking
    TradeCheckingComponent,
    CreditProposalTradeCheckingBuyersComponent,
    CreditProposalTradeCheckingBuyersDialogComponent,
    CreditProposalTradeCheckingBuyersDialogEditComponent,
    CreditProposalTradeCheckingSupplierComponent,
    CreditProposalTradeCheckingSupplierDialogComponent,
    CreditProposalTradeCheckingSupplierDialogEditComponent,
    CollateralInfoComponent,
    ReportIndependentCollateralComponent,
    CollateralAppraisalValuationComponent,
    CollateralAppraisalValuationMachineComponent,
    CollateralAppraisalValuationLandDialogComponent,
    CollateralAppraisalValuationVehicleComponent,
    CollateralAppraisalValuationPropertyComponent,
    CollateralAppraisalDetailProcessRealEstateComponent,
    CollateralAppraisalDetailProcessUnitConditionComponent,
    CollateralAppraisalDetailProcessLandCertificatesComponent,
    CollateralAppraisalDetailProcessLandComponent,
    DebtorDataViewUploadComponent,
    CollateralAppraisalNewInfoComponent,
    TypeDialogAppraisalComponent,
    DarCovenantAboveComponent,
    DarCovenantBackToBackDepositComponent,
    DarCovenantBackToBackGeneralComponent,
    CollateralAppraisalForwardToComponent,
    DialogBorrowerComponent,
    AppraisalRoleComponent,
    FacilityInfoGroupComponent,
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
    DocumentTypeViewComponent,
    LendingProgramParameterViewComponent,
    RequestSlikViewComponent,
    CollateralPropertyPersonalCorporateGuaranteeComponent,
    // cross idd //
    ParipasuCollateralIddDebtorComponent,
    ParipasuCollateralIddComponent,
    GroupCollateralInfoComponent,
    GroupCollateralListComponent,
    InsuranceInformationIddComponent,
    // cross cp //
    ParipasuCollateralGroupComponent,
    ParipasuCollateralDebiturComponent,
    GroupCollateralListCpComponent,
    SummaryGridComponent,
    SummaryGridBtbComponent,
    // cross appraisal //
    GroupCollateralListAppraisalComponent,
    GroupCollateralAppraisalComponent,
    // cross dar //
    GroupCollateralDarComponent,
    GroupCollateralListDarComponent,
    MainFacilityInfoComponent,
    MainFacilityComponent,
    MainFacilityChildComponent,
    DebtorInformationComponent,
    MainFacilityHistoryComponent,
    MainFacilityChildHistoryComponent,
    CertificateInfoComponent,
    CpMemoBandingLoanFacilityComponent,
    CpMemoBandingCollateralComponent,
    CpMemoBandingCollateralAboveComponent,
    CPMemoBandingStandardCovenantComponent,
    CPMemoBandingCovenantAboveComponent,
    CPMemoBandingCovenantBelowComponent,
    CPMemoBandingCovenantBackToBackDepositComponent,
    CPMemoBandingCovenantBackToBackGeneralComponent,
    CpMemoBandingOtherCovenantComponent,
    CPMemoBandingCollateralBacktobackComponent,
    CreditProposalSummaryGenerateMemoBandingComponent,
    CreditProposalCollateralSummaryDialogComponent,

    // Agreement Compare
    SignerPerjanjialKreditDialogComponent,
    CreditProposalGeneratePkReportComponent,
    StandartConvenantComponent,
    StandartDeviationComponent,
    OfferingLetterSignerPageComponent,
    OfferingLetterSignerPageDialogComponent,
    ClausalPkDialogComponent,

    // DAR
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
    CreditProposalMappingCollateralTempComponent,
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
    insuranceInformationComponent,
    InsuranceInfoDialogComponent,
    GridDetailInsuranceComponent,
    InsuranceInfoDialogDetailComponent,
    InsuranceDocumentComponent,
    InsuranceDocumentDialogComponent,
    // DEV
    DeveloperShowDiagramStateMultipleComponent,
    DeveloperShowDiagramStateMultipleDialogComponent,
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
    GeneratePKDraftComponent,
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
    MappingFacilityLoanOpsComponent,
    CollateralInfoDialogLoanOpsComponent,
    DocumentChecklistOpinionComponent,
  ],
  /* jhipster-needle-as-list-export-shared-module - JHipster will add entity exports imports here */
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedEntityModule {}
