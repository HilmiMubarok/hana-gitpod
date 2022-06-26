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

import { BillingTypeViewComponent } from './billing-type/billing-type-view.component';
import { PaymentTypeViewComponent } from './payment-type/payment-type-view.component';
import { BillingItemTypeMapViewComponent } from './billing-item-type-map/billing-item-type-map-view.component';
import { BillingItemAsChildComponent } from './billing-item/billing-item-as-child.component';
import { BillingItemViewComponent } from './billing-item/billing-item-view.component';
import { BillingItemTypeViewComponent } from './billing-item-type/billing-item-type-view.component';
import { GLAccountViewComponent } from './gl-account/gl-account-view.component';
import { GLAccountTypeViewComponent } from './gl-account-type/gl-account-type-view.component';
import { BillingViewComponent } from './billing/billing-view.component';
import { PartyViewComponent } from './party/party-view.component';
import { PersonViewComponent } from './person/person-view.component';
import { PartyGroupViewComponent } from './party-group/party-group-view.component';
import { PartyTypeViewComponent } from './party-type/party-type-view.component';
import { ProductViewComponent } from './product/product-view.component';
import { ProductTypeViewComponent } from './product-type/product-type-view.component';
import { FeatureTypeViewComponent } from './feature-type/feature-type-view.component';
import { FeatureViewComponent } from './feature/feature-view.component';
import { PaymentViewComponent } from './payment/payment-view.component';
import { PaymentApplicationAsChildComponent } from './payment-application/payment-application-as-child.component';
import { PaymentApplicationViewComponent } from './payment-application/payment-application-view.component';
import { BaseAccountViewComponent } from './base-account/base-account-view.component';
import { AccountTypeViewComponent } from './account-type/account-type-view.component';
import { FinAccountViewComponent } from './fin-account/fin-account-view.component';
import { AccountTransTypeViewComponent } from './account-trans-type/account-trans-type-view.component';
import { AccountTransViewComponent } from './account-trans/account-trans-view.component';
import { AccountTransCategoryViewComponent } from './account-trans-category/account-trans-category-view.component';
import { AccountBalancedViewComponent } from './account-balanced/account-balanced-view.component';
import { AcctgTransTypeViewComponent } from './acctg-trans-type/acctg-trans-type-view.component';
import { AcctgTransViewComponent } from './acctg-trans/acctg-trans-view.component';
import { AcctgTransItemViewComponent } from './acctg-trans-item/acctg-trans-item-view.component';
import { PeriodViewComponent } from './period/period-view.component';
import { FinAccountTransViewComponent } from './fin-account-trans/fin-account-trans-view.component';
import { GLAccountClassViewComponent } from './gl-account-class/gl-account-class-view.component';
import { GLResourceTypeViewComponent } from './gl-resource-type/gl-resource-type-view.component';
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
import { RoleTypeViewComponent } from './role-type/role-type-view.component';
import { PaymentGLAccountTypeMapViewComponent } from './payment-gl-account-type-map/payment-gl-account-type-map-view.component';
import { PaymentMethodViewComponent } from './payment-method/payment-method-view.component';
import { PaymentMethodTypeViewComponent } from './payment-method-type/payment-method-type-view.component';
import { PeriodTypeViewComponent } from './period-type/period-type-view.component';
import { ReligionTypeViewComponent } from './religion-type/religion-type-view.component';
import { WorkTypeViewComponent } from './work-type/work-type-view.component';
import { ContactMechTypeViewComponent } from './contact-mech-type/contact-mech-type-view.component';
import { PurposeTypeViewComponent } from './purpose-type/purpose-type-view.component';
import { ProductConfigViewComponent } from './product-config/product-config-view.component';
import { UomViewComponent } from './uom/uom-view.component';
import { UomTypeViewComponent } from './uom-type/uom-type-view.component';
import { UomConversionViewComponent } from './uom-conversion/uom-conversion-view.component';
import { TaxTypeViewComponent } from './tax-type/tax-type-view.component';
import { TermTypeViewComponent } from './term-type/term-type-view.component';
import { FeatureApplicableViewComponent } from './feature-applicable/feature-applicable-view.component';
import { GoodIdentificationViewComponent } from './good-identification/good-identification-view.component';
import { IdentificationTypeViewComponent } from './identification-type/identification-type-view.component';
import { DisbursementViewComponent } from './disbursement/disbursement-view.component';
import { SettlementTypeViewComponent } from './settlement-type/settlement-type-view.component';
import { SettlementViewComponent } from './settlement/settlement-view.component';
import { FinancingRequestViewComponent } from './financing-request/financing-request-view.component';
import { OrganizationCustomerViewComponent } from './organization-customer/organization-customer-view.component';
import { RoleCustomerViewComponent } from './role-customer/role-customer-view.component';
import { PersonalCustomerViewComponent } from './personal-customer/personal-customer-view.component';
import { RoleVendorViewComponent } from './role-vendor/role-vendor-view.component';
import { VendorViewComponent } from './vendor/vendor-view.component';
import { RoleInternalViewComponent } from './role-internal/role-internal-view.component';
import { InternalViewComponent } from './internal/internal-view.component';
import { ParentOrganizationViewComponent } from './parent-organization/parent-organization-view.component';
import { GoodAsListComponent } from './good/good-as-list.component';
import { GoodViewComponent } from './good/good-view.component';
import { VendorProductViewComponent } from './vendor-product/vendor-product-view.component';
import { BillingTermAsChildComponent } from './billing-term/billing-term-as-child.component';
import { BillingTermViewComponent } from './billing-term/billing-term-view.component';
import { PartyPaymentPrefViewComponent } from './party-payment-pref/party-payment-pref-view.component';
import { ServiceProductAsListComponent } from './service-product/service-product-as-list.component';
import { ServiceProductViewComponent } from './service-product/service-product-view.component';
import { BillViewComponent } from './bill/bill-view.component';
import { InvoiceViewComponent } from './invoice/invoice-view.component';
import { ReceiptViewComponent } from './receipt/receipt-view.component';
import { FinancialProductAsListComponent } from './financial-product/financial-product-as-list.component';
import { FinancialProductViewComponent } from './financial-product/financial-product-view.component';
import { ProductTypeFinancialSettingViewComponent } from './product-type-financial-setting/product-type-financial-setting-view.component';
import { FuncSettingTemplateViewComponent } from './func-setting-template/func-setting-template-view.component';
import { FuncSettingViewComponent } from './func-setting/func-setting-view.component';
import { LoanApplicationViewComponent } from './loan-application/loan-application-view.component';
import { ApplicationTypeViewComponent } from './application-type/application-type-view.component';
import { FacilityTypeViewComponent } from './facility-type/facility-type-view.component';
import { FacilityViewComponent } from './facility/facility-view.component';
import { InternalTypeViewComponent } from './internal-type/internal-type-view.component';
import { ProductTypeConfigViewComponent } from './product-type-config/product-type-config-view.component';
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
    // ngx
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  // prettier-ignore
  declarations: [
    BillingTypeViewComponent,
    PaymentTypeViewComponent,
    BillingItemTypeMapViewComponent,
    BillingItemAsChildComponent,
    BillingItemViewComponent,
    BillingItemTypeViewComponent,
    GLAccountViewComponent,
    GLAccountTypeViewComponent,
    BillingViewComponent,
    PartyViewComponent,
    PersonViewComponent,
    PartyGroupViewComponent,
    PartyTypeViewComponent,
    ProductViewComponent,
    ProductTypeViewComponent,
    FeatureTypeViewComponent,
    FeatureViewComponent,
    PaymentViewComponent,
    PaymentApplicationAsChildComponent,
    PaymentApplicationViewComponent,
    BaseAccountViewComponent,
    FinAccountViewComponent,
    AccountTypeViewComponent,
    AccountTransTypeViewComponent,
    AccountTransViewComponent,
    AccountTransCategoryViewComponent,
    AccountBalancedViewComponent,
    AcctgTransTypeViewComponent,
    AcctgTransViewComponent,
    AcctgTransItemViewComponent,
    PeriodViewComponent,
    FinAccountTransViewComponent,
    GLAccountClassViewComponent,
    GLResourceTypeViewComponent,
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
    RoleTypeViewComponent,
    PaymentGLAccountTypeMapViewComponent,
    PaymentMethodViewComponent,
    PaymentMethodTypeViewComponent,
    PeriodTypeViewComponent,
    ReligionTypeViewComponent,
    WorkTypeViewComponent,
    ContactMechTypeViewComponent,
    PurposeTypeViewComponent,
    ProductConfigViewComponent,
    UomViewComponent,
    UomTypeViewComponent,
    UomConversionViewComponent,
    TaxTypeViewComponent,
    TermTypeViewComponent,
    FeatureApplicableViewComponent,
    GoodIdentificationViewComponent,
    IdentificationTypeViewComponent,
    DisbursementViewComponent,
    SettlementTypeViewComponent,
    SettlementViewComponent,
    FinancingRequestViewComponent,
    OrganizationCustomerViewComponent,
    RoleCustomerViewComponent,
    PersonalCustomerViewComponent,
    RoleVendorViewComponent,
    VendorViewComponent,
    RoleInternalViewComponent,
    InternalViewComponent,
    ParentOrganizationViewComponent,
    GoodAsListComponent,
    GoodViewComponent,
    VendorProductViewComponent,
    BillingTermAsChildComponent,
    BillingTermViewComponent,
    PartyPaymentPrefViewComponent,
    ServiceProductAsListComponent,
    ServiceProductViewComponent,
    BillViewComponent,
    InvoiceViewComponent,
    ReceiptViewComponent,
    FinancialProductAsListComponent,
    FinancialProductViewComponent,
    ProductTypeFinancialSettingViewComponent,
    FuncSettingTemplateViewComponent,
    FuncSettingViewComponent,
    LoanApplicationViewComponent,
    ApplicationTypeViewComponent,
    FacilityTypeViewComponent,
    FacilityViewComponent,
    InternalTypeViewComponent,
    ProductTypeConfigViewComponent,
    /* jhipster-needle-declaration-entity-as-list */
  ],
  entryComponents: [],
  // prettier-ignore
  exports: [
    BillingTypeViewComponent, // Remove Me
    PaymentTypeViewComponent, // Remove Me
    BillingItemTypeMapViewComponent, // Remove Me
    BillingItemAsChildComponent, // Remove Me
    BillingItemViewComponent, // Remove Me
    BillingItemTypeViewComponent, // Remove Me
    GLAccountViewComponent, // Remove Me
    GLAccountTypeViewComponent, // Remove Me
    BillingViewComponent, // Remove Me
    PartyViewComponent, // Remove Me
    PersonViewComponent, // Remove Me
    PartyGroupViewComponent, // Remove Me
    PartyTypeViewComponent, // Remove Me
    ProductViewComponent, // Remove Me
    ProductTypeViewComponent, // Remove Me
    FeatureTypeViewComponent, // Remove Me
    FeatureViewComponent, // Remove Me
    PaymentViewComponent, // Remove Me
    PaymentApplicationAsChildComponent, // Remove Me
    PaymentApplicationViewComponent, // Remove Me
    BaseAccountViewComponent, // Remove Me
    FinAccountViewComponent, // Remove Me
    AccountTypeViewComponent,
    AccountTransTypeViewComponent, // Remove Me
    AccountTransViewComponent, // Remove Me
    AccountTransCategoryViewComponent, // Remove Me
    AccountBalancedViewComponent, // Remove Me
    AcctgTransTypeViewComponent, // Remove Me
    AcctgTransViewComponent, // Remove Me
    AcctgTransItemViewComponent, // Remove Me
    PeriodViewComponent, // Remove Me
    FinAccountTransViewComponent, // Remove Me
    GLAccountClassViewComponent, // Remove Me
    GLResourceTypeViewComponent, // Remove Me
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
    RoleTypeViewComponent, // Remove Me
    PaymentGLAccountTypeMapViewComponent, // Remove Me
    PaymentMethodViewComponent, // Remove Me
    PaymentMethodTypeViewComponent, // Remove Me
    PeriodTypeViewComponent, // Remove Me
    ReligionTypeViewComponent, // Remove Me
    WorkTypeViewComponent, // Remove Me
    ContactMechTypeViewComponent, // Remove Me
    PurposeTypeViewComponent, // Remove Me
    ProductConfigViewComponent, // Remove Me
    UomViewComponent, // Remove Me
    UomTypeViewComponent, // Remove Me
    UomConversionViewComponent, // Remove Me
    TaxTypeViewComponent, // Remove Me
    TermTypeViewComponent, // Remove Me
    FeatureApplicableViewComponent, // Remove Me
    GoodIdentificationViewComponent, // Remove Me
    IdentificationTypeViewComponent, // Remove Me
    DisbursementViewComponent,
    SettlementTypeViewComponent, // Remove Me
    SettlementViewComponent, // Remove Me
    FinancingRequestViewComponent, // Remove Me
    OrganizationCustomerViewComponent, // Remove Me
    RoleCustomerViewComponent, // Remove Me
    PersonalCustomerViewComponent, // Remove Me
    RoleVendorViewComponent, // Remove Me
    VendorViewComponent,
    RoleInternalViewComponent, // Remove Me
    InternalViewComponent,
    ParentOrganizationViewComponent, // Remove Me
    GoodAsListComponent, // Remove Me
    GoodViewComponent, // Remove Me
    VendorProductViewComponent, // Remove Me
    BillingTermAsChildComponent, // Remove Me
    BillingTermViewComponent, // Remove Me
    PartyPaymentPrefViewComponent, // Remove Me
    ServiceProductAsListComponent, // Remove Me
    ServiceProductViewComponent, // Remove Me
    BillViewComponent, // Remove Me
    InvoiceViewComponent, // Remove Me
    ReceiptViewComponent, // Remove Me
    DisbursementViewComponent, // Remove Me
    FinancialProductAsListComponent, // Remove Me
    FinancialProductViewComponent, // Remove Me
    ProductTypeFinancialSettingViewComponent, // Remove Me
    FuncSettingTemplateViewComponent, // Remove Me
    FuncSettingViewComponent, // Remove Me
    LoanApplicationViewComponent, // Remove Me
    ApplicationTypeViewComponent, // Remove Me
    FacilityTypeViewComponent, // Remove Me
    FacilityViewComponent, // Remove Me
    InternalTypeViewComponent, // Remove Me
    ProductTypeConfigViewComponent, // Remove Me
    /* jhipster-needle-as-list-export-shared-module - JHipster will add entity exports imports here */
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedEntityModule {}
