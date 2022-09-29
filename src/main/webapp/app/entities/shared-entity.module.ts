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
import { GeoBoundaryViewComponent } from './geo-boundary/geo-boundary-view.component';
import { PartyCategoryViewComponent } from './party-category/party-category-view.component';
import { PartyCategoryTypeViewComponent } from './party-category-type/party-category-type-view.component';
import { PartyClassificationAsChildComponent } from './party-classification/party-classification-as-child.component';
import { PartyClassificationViewComponent } from './party-classification/party-classification-view.component';
import { ProductCategoryViewComponent } from './product-category/product-category-view.component';
import { ProductCategoryTypeViewComponent } from './product-category-type/product-category-type-view.component';
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
import { GoodIdentificationViewComponent } from './good-identification/good-identification-view.component';
import { IdentificationTypeViewComponent } from './identification-type/identification-type-view.component';
import { SettlementTypeViewComponent } from './settlement-type/settlement-type-view.component';
import { SettlementViewComponent } from './settlement/settlement-view.component';
import { OrganizationCustomerViewComponent } from './organization-customer/organization-customer-view.component';
import { PersonalCustomerViewComponent } from './personal-customer/personal-customer-view.component';
import { InternalViewComponent } from './internal/internal-view.component';
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
import { CollateralAppraisalComparisonDialogComponent } from './collateral-appraisal/comparison/collateral-appraisal-comparison-dialog.component';
import { CollateralAppraisalProcessComponent } from './collateral-appraisal/foto/collateral-appraisal-process.component';
import { CollateralAppraisalSummaryComponent } from './collateral-appraisal/summary/collateral-appraisal-summary.component';
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
import { DocumentUploadDialogComponent } from './document/document-upload-dialog.component';
import { DocumentDetailDialogComponent } from './document/document-detail-dialog.component';

import { CreditProposalLoanFacilityDetailComponent } from './credit-proposal/credit-proposal-loan-facility-detail.component';
import { CreditProposalTabLoanFacilityDetailComponent } from './credit-proposal/credit-proposal-tab-loan-facility-detail.component';
import { CreditProposalTabLoanFacilityDetailGridComponent } from './credit-proposal/credit-proposal-tab-loan-facility-detail.grid.component';
import { CreditProposalCorrespondenceComponent } from './credit-proposal/correspondence/credit-proposal-correspondence.component';
import { CorrespondenceDialogComponent } from './credit-proposal/correspondence/correspondence-dialog.component';

import { CreditProposalOpinionHistoryComponent } from './credit-proposal/credit-proposal-opinion-history.component';
import { SlikSummaryComponent } from './credit-proposal/slik-summary/slik-summary.component';
import { SlikSummaryDebiturComponent } from './credit-proposal/slik-summary/debitur/slik-summary-debitur.component';
import { SlikSummaryDebiturDialogComponent } from './credit-proposal/slik-summary/debitur/slik-summary-debitur-dialog.component';
import { SlikSummaryShareHolderComponent } from './credit-proposal/slik-summary/share-holder/slik-summary-share-holder.component';
import { SlikSummaryShareHolderDialogComponent } from './credit-proposal/slik-summary/share-holder/slik-summary-share-holder-dialog.component';
import { SlikSummaryBusinessGroupComponent } from './credit-proposal/slik-summary/business-group/slik-summary-business-group.component';
import { SlikSummaryBusinessGroupDialogComponent } from './credit-proposal/slik-summary/business-group/slik-summary-business-group-dialog.component';
import { CreditProposalCollateralInfoComponent } from './credit-proposal/collateral-info/credit-proposal-collateral-info.component';
import { CreditProposalTabCovenantComponent } from './credit-proposal/convenant/credit-proposal-tab-covenant.component';
import { CreditProposalCovenantDocumentTabDeviationComponent } from './credit-proposal/convenant/credit-proposal-covenant-document-tab-deviation.component';
/* jhipster-needle-import-entity-as-list - JHipster will add entity modules imports here */

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
    GeoBoundaryViewComponent,
    PartyCategoryViewComponent,
    PartyCategoryTypeViewComponent,
    PartyClassificationAsChildComponent,
    PartyClassificationViewComponent,
    ProductCategoryViewComponent,
    ProductCategoryTypeViewComponent,
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
    GoodIdentificationViewComponent,
    IdentificationTypeViewComponent,
    SettlementTypeViewComponent,
    SettlementViewComponent,
    OrganizationCustomerViewComponent,
    PersonalCustomerViewComponent,
    InternalViewComponent,
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
    CollateralAppraisalComparisonDialogComponent,
    CollateralAppraisalProcessComponent,
    CollateralAppraisalSummaryComponent,
    PartyCifViewComponent,
    CollateralPropertyViewComponent,
    EmployeeViewComponent,
    EmploymentTypeViewComponent,
    PositionViewComponent,
    PositionTypeViewComponent,
    SurveyorViewComponent,
    CollateralAppraisalComparisonComponent,
    CollateralAppraisalComparisonDialogComponent,
    PartnerViewComponent,
    AccountViewComponent,
    ApplicationProductViewComponent,
    BaseApplicationViewComponent,
    DocumentComponent,
    DocumentUploadDialogComponent,
    DocumentDetailDialogComponent,
    CreditProposalLoanFacilityDetailComponent,
    CreditProposalTabLoanFacilityDetailComponent,
    CreditProposalTabLoanFacilityDetailGridComponent,
    CreditProposalCorrespondenceComponent,
    CorrespondenceDialogComponent,
    CreditProposalOpinionHistoryComponent,
    SlikSummaryComponent,
    SlikSummaryDebiturComponent,
    SlikSummaryDebiturDialogComponent,
    SlikSummaryShareHolderComponent,
    SlikSummaryShareHolderDialogComponent,
    SlikSummaryBusinessGroupComponent,
	SlikSummaryBusinessGroupDialogComponent,
	CreditProposalCollateralInfoComponent,
	CreditProposalTabCovenantComponent,
	CreditProposalCovenantDocumentTabDeviationComponent
    /* jhipster-needle-declaration-entity-as-list */
  ],
  entryComponents: [],
  // prettier-ignore
  exports: [
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
    GeoBoundaryViewComponent, // Remove Me
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
    GoodIdentificationViewComponent, // Remove Me
    IdentificationTypeViewComponent, // Remove Me
    SettlementTypeViewComponent, // Remove Me
    SettlementViewComponent, // Remove Me
    OrganizationCustomerViewComponent, // Remove Me
    PersonalCustomerViewComponent, // Remove Me
    InternalViewComponent, // Remove Me
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
    CollateralAppraisalComparisonDialogComponent, // Remove Me
    CollateralAppraisalProcessComponent, // Remove Me
    CollateralAppraisalSummaryComponent, // Remove Me
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
    CorrespondenceDialogComponent, // Remove Me
	CreditProposalLoanFacilityDetailComponent, // Remove Me
	CreditProposalTabLoanFacilityDetailComponent, // Remove Me
	CreditProposalTabLoanFacilityDetailGridComponent, // Remove Me
  	CreditProposalOpinionHistoryComponent, // Remove Me
    SlikSummaryComponent, // Remove Me
    SlikSummaryDebiturComponent, // Remove Me
    SlikSummaryDebiturDialogComponent, // Remove Me
    SlikSummaryShareHolderComponent, // Remove Me
    SlikSummaryShareHolderDialogComponent, // Remove Me
    SlikSummaryBusinessGroupComponent, // Remove Me
    SlikSummaryBusinessGroupDialogComponent, // Remove Me
	CreditProposalCollateralInfoComponent, // Remove Me
	CreditProposalTabCovenantComponent, // Remove Me
	CreditProposalCovenantDocumentTabDeviationComponent
    /* jhipster-needle-as-list-export-shared-module - JHipster will add entity exports imports here */
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedEntityModule {}
