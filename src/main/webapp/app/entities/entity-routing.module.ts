import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sample-form',
        loadChildren: () => import('./sample-form/sample-form.module').then(m => m.LosgwSampleFormModule),
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
        path: 'base-account',
        loadChildren: () => import('./base-account/base-account.module').then(m => m.LosgwBaseAccountModule),
      },
      {
        path: 'account-type',
        loadChildren: () => import('./account-type/account-type.module').then(m => m.LosgwAccountTypeModule),
      },
      {
        path: 'period',
        loadChildren: () => import('./period/period.module').then(m => m.LosgwPeriodModule),
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
        path: 'period-type',
        loadChildren: () => import('./period-type/period-type.module').then(m => m.LosgwPeriodTypeModule),
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
        path: 'settlement-type',
        loadChildren: () => import('./settlement-type/settlement-type.module').then(m => m.LosgwSettlementTypeModule),
      },
      {
        path: 'settlement',
        loadChildren: () => import('./settlement/settlement.module').then(m => m.LosgwSettlementModule),
      },
      {
        path: 'organization-customer',
        loadChildren: () => import('./organization-customer/organization-customer.module').then(m => m.LosgwOrganizationCustomerModule),
      },
      {
        path: 'personal-customer',
        loadChildren: () => import('./personal-customer/personal-customer.module').then(m => m.LosgwPersonalCustomerModule),
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
        path: 'vendor-product',
        loadChildren: () => import('./vendor-product/vendor-product.module').then(m => m.LosgwVendorProductModule),
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
      {
        path: 'customer-info',
        data: { pageTitle: 'losgwApp.customerInfo.home.title' },
        loadChildren: () => import('./customer-info/customer-info.module').then(m => m.LosgwCustomerInfoModule),
      },
      {
        path: 'employment',
        data: { pageTitle: 'losgwApp.employment.home.title' },
        loadChildren: () => import('./employment/employment.module').then(m => m.LosgwEmploymentModule),
      },
      {
        path: 'organization-legal',
        data: { pageTitle: 'losgwApp.organizationLegal.home.title' },
        loadChildren: () => import('./organization-legal/organization-legal.module').then(m => m.LosgwOrganizationLegalModule),
      },
      {
        path: 'credit-rating',
        data: { pageTitle: 'losgwApp.creditRating.home.title' },
        loadChildren: () => import('./credit-rating/credit-rating.module').then(m => m.LosgwCreditRatingModule),
      },
      {
        path: 'organization-management',
        data: { pageTitle: 'losgwApp.organizationManagement.home.title' },
        loadChildren: () =>
          import('./organization-management/organization-management.module').then(m => m.LosgwOrganizationManagementModule),
      },
      {
        path: 'cif',
        data: { pageTitle: 'losgwApp.cif.home.title' },
        loadChildren: () => import('./cif/cif.module').then(m => m.LosgwCifModule),
      },
      {
        path: 'party-group',
        data: { pageTitle: 'losgwApp.partyGroup.home.title' },
        loadChildren: () => import('./party-group/party-group.module').then(m => m.LosgwPartyGroupModule),
      },
      {
        path: 'application',
        loadChildren: () => import('./application/application.module').then(m => m.LosgwApplicationModule),
      },
      {
        path: 'relation-type',
        loadChildren: () => import('./relation-type/relation-type.module').then(m => m.LosgwRelationTypeModule),
      },
      {
        path: 'credit-application',
        loadChildren: () => import('./credit-application/credit-application.module').then(m => m.LosgwCreditApplicationModule),
      },
      {
        path: 'comm-event',
        loadChildren: () => import('./comm-event/comm-event.module').then(m => m.LosgwCommEventModule),
      },
      {
        path: 'party-identification',
        loadChildren: () => import('./party-identification/party-identification.module').then(m => m.LosgwPartyIdentificationModule),
      },
      {
        path: 'status-item',
        loadChildren: () => import('./status-item/status-item.module').then(m => m.LosgwStatusItemModule),
      },
      {
        path: 'party-slik',
        loadChildren: () => import('./party-slik/party-slik.module').then(m => m.LosgwPartySlikModule),
      },
      {
        path: 'postal-address',
        loadChildren: () => import('./postal-address/postal-address.module').then(m => m.LosgwPostalAddressyModule),
      },
      {
        path: 'credit-facility',
        loadChildren: () => import('./credit-facility/credit-facility.module').then(m => m.LosgwCreditFacilityModule),
      },
      {
        path: 'party-cif',
        loadChildren: () => import('./party-cif/party-cif.module').then(m => m.LosgwPartyCifModule),
      },
      {
        path: 'collateral-property',
        loadChildren: () => import('./collateral-property/collateral-property.module').then(m => m.LosgwCollateralPropertyModule),
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.LosgwEmployeeModule),
      },
      {
        path: 'employment-type',
        loadChildren: () => import('./employment-type/employment-type.module').then(m => m.LosgwEmploymentTypeModule),
      },
      {
        path: 'position',
        loadChildren: () => import('./position/position.module').then(m => m.LosgwPositionModule),
      },
      {
        path: 'position-type',
        loadChildren: () => import('./position-type/position-type.module').then(m => m.LosgwPositionTypeModule),
      },
      {
        path: 'surveyor',
        loadChildren: () => import('./surveyor/surveyor.module').then(m => m.LosgwSurveyorModule),
      },
      {
        path: 'partner',
        loadChildren: () => import('./partner/partner.module').then(m => m.LosgwPartnerModule),
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
        path: 'organization-financial',
        data: { pageTitle: 'losgwApp.organizationFinancial.home.title' },
        loadChildren: () => import('./organization-financial/organization-financial.module').then(m => m.LosgwOrganizationFinancialModule),
      },
      {
        path: 'collateral-type',
        data: { pageTitle: 'losgwApp.collateralType.home.title' },
        loadChildren: () => import('./collateral-type/collateral-type.module').then(m => m.LosgwCollateralTypeModule),
      },
      {
        path: 'collateral',
        data: { pageTitle: 'losgwApp.collateral.home.title' },
        loadChildren: () => import('./collateral/collateral.module').then(m => m.LosgwCollateralModule),
      },
      {
        path: 'credit-proposal',
        loadChildren: () => import('./credit-proposal/credit-proposal.module').then(m => m.LosgwCreditProposalModule),
      },
      {
        path: 'comm-event-type',
        loadChildren: () => import('./comm-event-type/comm-event-type.module').then(m => m.LosgwCommEventTypeModule),
      },
      {
        path: 'collateral-appraisal',
        loadChildren: () => import('./collateral-appraisal/collateral-appraisal.module').then(m => m.LosgwCollateralAppraisalModule),
      },
      {
        path: 'collateral-appraisal-distribution-external',
        loadChildren: () => import('./collateral-appraisal/collateral-appraisal.module').then(m => m.LosgwCollateralAppraisalModule),
      },
      {
        path: 'collateral-appraisal-distribution-internal',
        loadChildren: () => import('./collateral-appraisal/collateral-appraisal.module').then(m => m.LosgwCollateralAppraisalModule),
      },
      {
        path: 'collateral-appraisal-process',
        loadChildren: () => import('./collateral-appraisal/collateral-appraisal.module').then(m => m.LosgwCollateralAppraisalModule),
      },
      {
        path: 'collateral-appraisal-report-approval',
        loadChildren: () => import('./collateral-appraisal/collateral-appraisal.module').then(m => m.LosgwCollateralAppraisalModule),
      },
      {
        path: 'collateral-appraisal-result-inqury',
        loadChildren: () => import('./collateral-appraisal/collateral-appraisal.module').then(m => m.LosgwCollateralAppraisalModule),
      },
      {
        path: 'loan-analys-distribution',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-analys',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-analys-sme-credit-review-checker',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-approval',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-approval-inquiry',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'dar-finalization',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'final-dar-checker',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-komite-approval',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'dar-notification',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'compliance-checking-distribution',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
	  {
        path: 'compliance-checking',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'finalize-offering-letter',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'offering-letter-review',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'offering-letter-confirmation',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.LosgwAccountModule),
      },
      {
        path: 'application-product',
        loadChildren: () => import('./application-product/application-product.module').then(m => m.LosgwApplicationProductModule),
      },
      {
        path: 'base-application',
        loadChildren: () => import('./base-application/base-application.module').then(m => m.LosgwBaseApplicationModule),
      },
      // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
    ]),
  ],
})
export class EntityRoutingModule {}
