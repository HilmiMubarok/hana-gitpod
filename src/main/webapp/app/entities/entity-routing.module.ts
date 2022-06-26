import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    //
    RouterModule.forChild([
      {
        path: 'billing-type',
        loadChildren: () => import('./billing-type/billing-type.module').then(m => m.LosgwBillingTypeModule),
      },
      {
        path: 'payment-type',
        loadChildren: () => import('./payment-type/payment-type.module').then(m => m.LosgwPaymentTypeModule),
      },
      {
        path: 'billing-item-type-map',
        loadChildren: () => import('./billing-item-type-map/billing-item-type-map.module').then(m => m.LosgwBillingItemTypeMapModule),
      },
      {
        path: 'billing-item',
        loadChildren: () => import('./billing-item/billing-item.module').then(m => m.LosgwBillingItemModule),
      },
      {
        path: 'billing-item-type',
        loadChildren: () => import('./billing-item-type/billing-item-type.module').then(m => m.LosgwBillingItemTypeModule),
      },
      {
        path: 'gl-account',
        loadChildren: () => import('./gl-account/gl-account.module').then(m => m.LosgwGLAccountModule),
      },
      {
        path: 'gl-account-type',
        loadChildren: () => import('./gl-account-type/gl-account-type.module').then(m => m.LosgwGLAccountTypeModule),
      },
      {
        path: 'billing',
        loadChildren: () => import('./billing/billing.module').then(m => m.LosgwBillingModule),
      },
      {
        path: 'party',
        loadChildren: () => import('./party/party.module').then(m => m.LosgwPartyModule),
      },
      {
        path: 'party-type',
        loadChildren: () => import('./party-type/party-type.module').then(m => m.LosgwPartyTypeModule),
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.LosgwProductModule),
      },
      {
        path: 'product-type',
        loadChildren: () => import('./product-type/product-type.module').then(m => m.LosgwProductTypeModule),
      },
      {
        path: 'feature-type',
        loadChildren: () => import('./feature-type/feature-type.module').then(m => m.LosgwFeatureTypeModule),
      },
      {
        path: 'feature',
        loadChildren: () => import('./feature/feature.module').then(m => m.LosgwFeatureModule),
      },
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.LosgwPaymentModule),
      },
      {
        path: 'payment-application',
        loadChildren: () => import('./payment-application/payment-application.module').then(m => m.LosgwPaymentApplicationModule),
      },
      {
        path: 'base-account',
        loadChildren: () => import('./base-account/base-account.module').then(m => m.LosgwBaseAccountModule),
      },
      {
        path: 'account-type',
        loadChildren: () => import('./account-type/account-type.module').then(m => m.LosgwAccountTypeModule),
      },
      {
        path: 'fin-account',
        loadChildren: () => import('./fin-account/fin-account.module').then(m => m.LosgwFinAccountModule),
      },
      {
        path: 'account-trans-type',
        loadChildren: () => import('./account-trans-type/account-trans-type.module').then(m => m.LosgwAccountTransTypeModule),
      },
      {
        path: 'account-trans',
        loadChildren: () => import('./account-trans/account-trans.module').then(m => m.LosgwAccountTransModule),
      },
      {
        path: 'account-trans-category',
        loadChildren: () => import('./account-trans-category/account-trans-category.module').then(m => m.LosgwAccountTransCategoryModule),
      },
      {
        path: 'account-balanced',
        loadChildren: () => import('./account-balanced/account-balanced.module').then(m => m.LosgwAccountBalancedModule),
      },
      {
        path: 'acctg-trans-type',
        loadChildren: () => import('./acctg-trans-type/acctg-trans-type.module').then(m => m.LosgwAcctgTransTypeModule),
      },
      {
        path: 'acctg-trans',
        loadChildren: () => import('./acctg-trans/acctg-trans.module').then(m => m.LosgwAcctgTransModule),
      },
      {
        path: 'acctg-trans-item',
        loadChildren: () => import('./acctg-trans-item/acctg-trans-item.module').then(m => m.LosgwAcctgTransItemModule),
      },
      {
        path: 'period',
        loadChildren: () => import('./period/period.module').then(m => m.LosgwPeriodModule),
      },
      {
        path: 'fin-account-trans',
        loadChildren: () => import('./fin-account-trans/fin-account-trans.module').then(m => m.LosgwFinAccountTransModule),
      },
      {
        path: 'gl-account-class',
        loadChildren: () => import('./gl-account-class/gl-account-class.module').then(m => m.LosgwGLAccountClassModule),
      },
      {
        path: 'gl-resource-type',
        loadChildren: () => import('./gl-resource-type/gl-resource-type.module').then(m => m.LosgwGLResourceTypeModule),
      },
      {
        path: 'state-boundary',
        loadChildren: () => import('./state-boundary/state-boundary.module').then(m => m.LosgwStateBoundaryModule),
      },
      {
        path: 'party-role',
        loadChildren: () => import('./party-role/party-role.module').then(m => m.LosgwPartyRoleModule),
      },
      {
        path: 'geo-boundary-type',
        loadChildren: () => import('./geo-boundary-type/geo-boundary-type.module').then(m => m.LosgwGeoBoundaryTypeModule),
      },
      {
        path: 'geo-boundary',
        loadChildren: () => import('./geo-boundary/geo-boundary.module').then(m => m.LosgwGeoBoundaryModule),
      },
      {
        path: 'party-category',
        loadChildren: () => import('./party-category/party-category.module').then(m => m.LosgwPartyCategoryModule),
      },
      {
        path: 'party-category-type',
        loadChildren: () => import('./party-category-type/party-category-type.module').then(m => m.LosgwPartyCategoryTypeModule),
      },
      {
        path: 'party-classification',
        loadChildren: () => import('./party-classification/party-classification.module').then(m => m.LosgwPartyClassificationModule),
      },
      {
        path: 'product-category',
        loadChildren: () => import('./product-category/product-category.module').then(m => m.LosgwProductCategoryModule),
      },
      {
        path: 'product-category-type',
        loadChildren: () => import('./product-category-type/product-category-type.module').then(m => m.LosgwProductCategoryTypeModule),
      },
      {
        path: 'product-classification',
        loadChildren: () => import('./product-classification/product-classification.module').then(m => m.LosgwProductClassificationModule),
      },
      {
        path: 'role-type',
        loadChildren: () => import('./role-type/role-type.module').then(m => m.LosgwRoleTypeModule),
      },
      {
        path: 'payment-gl-account-type-map',
        loadChildren: () =>
          import('./payment-gl-account-type-map/payment-gl-account-type-map.module').then(m => m.LosgwPaymentGLAccountTypeMapModule),
      },
      {
        path: 'payment-method',
        loadChildren: () => import('./payment-method/payment-method.module').then(m => m.LosgwPaymentMethodModule),
      },
      {
        path: 'payment-method-type',
        loadChildren: () => import('./payment-method-type/payment-method-type.module').then(m => m.LosgwPaymentMethodTypeModule),
      },
      {
        path: 'period-type',
        loadChildren: () => import('./period-type/period-type.module').then(m => m.LosgwPeriodTypeModule),
      },
      {
        path: 'religion-type',
        loadChildren: () => import('./religion-type/religion-type.module').then(m => m.LosgwReligionTypeModule),
      },
      {
        path: 'work-type',
        loadChildren: () => import('./work-type/work-type.module').then(m => m.LosgwWorkTypeModule),
      },
      {
        path: 'contact-mech-type',
        loadChildren: () => import('./contact-mech-type/contact-mech-type.module').then(m => m.LosgwContactMechTypeModule),
      },
      {
        path: 'purpose-type',
        loadChildren: () => import('./purpose-type/purpose-type.module').then(m => m.LosgwPurposeTypeModule),
      },
      {
        path: 'product-config',
        loadChildren: () => import('./product-config/product-config.module').then(m => m.LosgwProductConfigModule),
      },
      {
        path: 'uom',
        loadChildren: () => import('./uom/uom.module').then(m => m.LosgwUomModule),
      },
      {
        path: 'uom-type',
        loadChildren: () => import('./uom-type/uom-type.module').then(m => m.LosgwUomTypeModule),
      },
      {
        path: 'uom-conversion',
        loadChildren: () => import('./uom-conversion/uom-conversion.module').then(m => m.LosgwUomConversionModule),
      },
      {
        path: 'tax-type',
        loadChildren: () => import('./tax-type/tax-type.module').then(m => m.LosgwTaxTypeModule),
      },
      {
        path: 'term-type',
        loadChildren: () => import('./term-type/term-type.module').then(m => m.LosgwTermTypeModule),
      },
      {
        path: 'feature-applicable',
        loadChildren: () => import('./feature-applicable/feature-applicable.module').then(m => m.LosgwFeatureApplicableModule),
      },
      {
        path: 'good-identification',
        loadChildren: () => import('./good-identification/good-identification.module').then(m => m.LosgwGoodIdentificationModule),
      },
      {
        path: 'identification-type',
        loadChildren: () => import('./identification-type/identification-type.module').then(m => m.LosgwIdentificationTypeModule),
      },
      {
        path: 'disbursement',
        loadChildren: () => import('./disbursement/disbursement.module').then(m => m.LosgwDisbursementModule),
      },
      {
        path: 'settlement-type',
        loadChildren: () => import('./settlement-type/settlement-type.module').then(m => m.LosgwSettlementTypeModule),
      },
      {
        path: 'settlement',
        loadChildren: () => import('./settlement/settlement.module').then(m => m.LosgwSettlementModule),
      },
      {
        path: 'financing-request',
        loadChildren: () => import('./financing-request/financing-request.module').then(m => m.LosgwFinancingRequestModule),
      },
      {
        path: 'organization-customer',
        loadChildren: () => import('./organization-customer/organization-customer.module').then(m => m.LosgwOrganizationCustomerModule),
      },
      {
        path: 'role-customer',
        loadChildren: () => import('./role-customer/role-customer.module').then(m => m.LosgwRoleCustomerModule),
      },
      {
        path: 'personal-customer',
        loadChildren: () => import('./personal-customer/personal-customer.module').then(m => m.LosgwPersonalCustomerModule),
      },
      {
        path: 'role-vendor',
        loadChildren: () => import('./role-vendor/role-vendor.module').then(m => m.LosgwRoleVendorModule),
      },
      {
        path: 'vendor',
        loadChildren: () => import('./vendor/vendor.module').then(m => m.LosgwVendorModule),
      },
      {
        path: 'role-internal',
        loadChildren: () => import('./role-internal/role-internal.module').then(m => m.LosgwRoleInternalModule),
      },
      {
        path: 'internal',
        loadChildren: () => import('./internal/internal.module').then(m => m.LosgwInternalModule),
      },
      {
        path: 'parent-organization',
        loadChildren: () => import('./parent-organization/parent-organization.module').then(m => m.LosgwParentOrganizationModule),
      },
      {
        path: 'good',
        loadChildren: () => import('./good/good.module').then(m => m.LosgwGoodModule),
      },
      {
        path: 'vendor-product',
        loadChildren: () => import('./vendor-product/vendor-product.module').then(m => m.LosgwVendorProductModule),
      },
      {
        path: 'billing-term',
        loadChildren: () => import('./billing-term/billing-term.module').then(m => m.LosgwBillingTermModule),
      },
      {
        path: 'party-payment-pref',
        loadChildren: () => import('./party-payment-pref/party-payment-pref.module').then(m => m.LosgwPartyPaymentPrefModule),
      },
      {
        path: 'service-product',
        loadChildren: () => import('./service-product/service-product.module').then(m => m.LosgwServiceProductModule),
      },
      {
        path: 'bill',
        loadChildren: () => import('./bill/bill.module').then(m => m.LosgwBillModule),
      },
      {
        path: 'invoice',
        loadChildren: () => import('./invoice/invoice.module').then(m => m.LosgwInvoiceModule),
      },
      {
        path: 'receipt',
        loadChildren: () => import('./receipt/receipt.module').then(m => m.LosgwReceiptModule),
      },
      {
        path: 'financial-product',
        loadChildren: () => import('./financial-product/financial-product.module').then(m => m.LosgwFinancialProductModule),
      },
      {
        path: 'product-type-financial-setting',
        loadChildren: () =>
          import('./product-type-financial-setting/product-type-financial-setting.module').then(
            m => m.LosgwProductTypeFinancialSettingModule
          ),
      },
      {
        path: 'sample-ejs',
        loadChildren: () => import('./sample-ejs/sample-ejs.module').then(m => m.LosgwSampleEjsModule),
      },
      {
        path: 'func-setting-template',
        loadChildren: () => import('./func-setting-template/func-setting-template.module').then(m => m.LosgwFuncSettingTemplateModule),
      },
      {
        path: 'func-setting',
        loadChildren: () => import('./func-setting/func-setting.module').then(m => m.LosgwFuncSettingModule),
      },
      {
        path: 'loan-application',
        loadChildren: () => import('./loan-application/loan-application.module').then(m => m.LosgwLoanApplicationModule),
      },
      {
        path: 'application-type',
        loadChildren: () => import('./application-type/application-type.module').then(m => m.losgwApplicationTypeModule),
      },
      {
        path: 'facility-type',
        loadChildren: () => import('./facility-type/facility-type.module').then(m => m.LosgwFacilityTypeModule),
      },
      {
        path: 'facility',
        loadChildren: () => import('./facility/facility.module').then(m => m.LosgwFacilityModule),
      },
      {
        path: 'internal-type',
        loadChildren: () => import('./internal-type/internal-type.module').then(m => m.LosgwInternalTypeModule),
      },
      {
        path: 'product-type-config',
        loadChildren: () => import('./product-type-config/product-type-config.module').then(m => m.LosgwProductTypeConfigModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
