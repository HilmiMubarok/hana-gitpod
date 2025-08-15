import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'legal-lending-limit-parameter',
        loadChildren: () =>
          import('./master-parameter/legal-lending-limit-parameter/legal-lending-limit-parameter.module').then(
            m => m.LosgwLegalLendingLimitParameterModule
          ),
      },
      {
        path: 'industry-limit-exposure-parameter',
        loadChildren: () =>
          import('./master-parameter/industry-limit-exposure-parameter/industry-limit-exposure-parameter.module').then(
            m => m.LosgwIndustryLimitExposureParameterModule
          ),
      },
      {
        path: 'application-option',
        loadChildren: () => import('./application-option/application-option.module').then(m => m.LosgwApplicationOptionModule),
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
        path: 'finalize-pk',
        loadChildren: () => import('./credit-agreement/credit-agreement.module').then(m => m.LosgwCreditAgreementModule),
      },
      {
        path: 'review-pk',
        loadChildren: () => import('./credit-agrement-review/credit-agreement-review.module').then(m => m.LosgwCreditAgreementReviewModule),
      },

      {
        path: 'finalize-dppk',
        loadChildren: () => import('./dppk-finalize/dppk-finalize.module').then(m => m.LosgwIDppkFinalizeModule),
      },
      {
        path: 'review-dppk',
        loadChildren: () => import('./dppk-review/dppk-review.module').then(m => m.LosgwIDppkReviewModule),
      },
      {
        path: 'insurance-check',
        loadChildren: () => import('./insurance-checking/insurance-checking.module').then(m => m.LosgwInsuranceCheckingModule),
      },
      {
        path: 'insurance-review',
        loadChildren: () => import('./review-insurance/review-insurance.module').then(m => m.LosgwIReviewInsuranceModule),
      },
      {
        path: 'loan-ops-distribution',
        loadChildren: () => import('./loan-operation/loan-operation.module').then(m => m.LosgwLoanOperationModule),
      },
      {
        path: 'loan-ops-checking',
        loadChildren: () => import('./loan-ops-checking/loan-ops-checking.module').then(m => m.LosgwLoanOpsCheckingModule),
      },
      {
        path: 'loan-ops-review',
        loadChildren: () => import('./loan-ops-review/laon-operation-review.module').then(m => m.LosgwLoanOpsReviewModule),
      },
      {
        path: 'credit-proposal-status',
        loadChildren: () => import('./credit-proposal/credit-proposal.module').then(m => m.LosgwCreditProposalModule),
      },
      {
        path: 'cp-status-approval',
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
        loadChildren: () =>
          import('./collateral-appraisal-process/collateral-appraisal-process.module').then(m => m.LosgwCollateralAppraisalProcessModule),
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
        path: 'la-distribution',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'la-analyst',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'la-SME-CRC',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'la-approval',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'la-approval-inquiry',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'dar-final',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'dar-checker',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-committee-approval',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'dar-notif',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'cc-distribution',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'cc-checking',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'cc-review',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'cc-inquiry',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'loan-analys-and-approval-monitoring',
        loadChildren: () => import('./loan-analys/loan-analys.module').then(m => m.LosgwLoanAnalysModule),
      },
      {
        path: 'distribution',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'finalize',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'review',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'confirmation',
        loadChildren: () => import('./offering-letter/offering-letter.module').then(m => m.LosgwOfferingLetterModule),
      },
      {
        path: 'history-proposal',
        loadChildren: () =>
          import('./party-cif/decision-approval-report/dar-checker-confirmation/history-proposal.module').then(
            m => m.LosgwHistoryProposalModule
          ),
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
      {
        path: 'batch-apprisal',
        loadChildren: () => import('./survey-batch/survey-batch.module').then(m => m.LosgwSurveyBatchModule),
      },
      {
        path: 'partner-kjpp',
        loadChildren: () => import('./partner/partner.module').then(m => m.LosgwPartnerModule),
      },
      {
        path: 'internal',
        loadChildren: () => import('./internal/internal.module').then(m => m.LosgwInternalModule),
      },
      {
        path: 'geo-boundary',
        loadChildren: () => import('./geo-boundary/geo-boundary.module').then(m => m.LosgwGeoBoundaryModule),
      },
      {
        path: 'position-reporting-structure',
        loadChildren: () =>
          import('./position-reporting-structure/position-reporting-structure.module').then(m => m.LosgwPositionReportingStructureModule),
      },
      {
        path: 'document-type',
        loadChildren: () => import('./document-type/document-type.module').then(m => m.LosgwDocumentTypeModule),
      },
      {
        path: 'lending-program-parameter',
        loadChildren: () =>
          import('./lending-program-parameter/lending-program-parameter.module').then(m => m.LosgwLendingProgramParameterModule),
      },
      {
        path: 'request-slik',
        loadChildren: () => import('./request-slik/request-slik.module').then(m => m.LosgwRequestSlikModule),
      },
      {
        path: 'list-of-value-parameter',
        loadChildren: () =>
          import('./master-parameter/master-lov-parameter/master-lov-parameter.module').then(m => m.LosgwMasterLovParameterModule),
      },
      {
        path: 'master-product-parameter',
        loadChildren: () =>
          import('./master-parameter/master-product/master-product-parameter.module').then(m => m.LosgwMasterProductParameterModule),
      },
      {
        path: 'product-category',
        loadChildren: () => import('./product-category/product-category.module').then(m => m.LosgwProductCategoryModule),
      },
      {
        path: 'collateral-parameter',
        loadChildren: () =>
          import('./master-parameter/collateral-parameter/collateral-parameter.module').then(m => m.LosgwCollateralParameterModule),
      },
      {
        path: 'master-compliance-checklist',
        loadChildren: () =>
          import('./master-parameter/compliance-checklist/master-compliance-checklist.module').then(
            m => m.LosgwMasterComplianceChecklistModule
          ),
      },
      {
        path: 'menu-permission',
        loadChildren: () =>
          import('./master-parameter/master-permission/master-permission.module').then(m => m.LosgwMasterPermissionModule),
      },
      {
        path: 'menu-access',
        loadChildren: () => import('./menu-access/menu-access.module').then(m => m.LosgwMenuAccessModule),
      },
      {
        path: 'finalize-dpdl',
        loadChildren: () => import('./dpdl-finalize/dpdl-finalize.module').then(m => m.DpdlFinalizeModule),
      },
      {
        path: 'review-dpdl',
        loadChildren: () => import('./dpdl-finalize/dpdl-finalize.module').then(m => m.DpdlFinalizeModule),
      },
      {
        path: 'dar-revision',
        loadChildren: () => import('./dar-revision/dar-revision.module').then(m => m.DarRevisionModule),
      },
      {
        path: 'dar-revision-checker',
        loadChildren: () => import('./dar-revision-checker/dar-revision-checker.module').then(m => m.DarRevisionCheckerModule),
      },
      {
        path: 'master-credit-agreement-clausal',
        loadChildren: () =>
          import('./master-parameter/master-credit-agreement-clausal/master-credit-agreement-clausal.module').then(
            m => m.LosgwMasterCreditAgreementClausalModule
          ),
      },
      {
        path: 'master-company-type',
        loadChildren: () =>
          import('./master-parameter/master-company-type/master-company-type.module').then(m => m.LosgwMasterCompanyTypeModule),
      },
      {
        path: 'master-document-term',
        loadChildren: () =>
          import('./master-parameter/master-document-term/master-document.term.module').then(m => m.LosgwMasterDocumentTermModule),
      },
      {
        path: 'master-financial-institution',
        loadChildren: () =>
          import('./master-parameter/financial-institution/master-financial-institution.module').then(
            m => m.LosgwMasterFinancialInstitutionModule
          ),
      },
      {
        path: 'bank-account',
        loadChildren: () => import('./bank-account/bank-account.module').then(m => m.BankAccountModule),
      },
      {
        path: 'tbo-legal-checking',
        loadChildren: () => import('./tbo-legal-monitoring/tbo-checking/tbo-checking.module').then(m => m.TboCheckingModule),
      },
      {
        path: 'tbo-legal-review',
        loadChildren: () => import('./tbo-legal-monitoring/tbo-review/tbo-review.module').then(m => m.TboReviewModule),
      },
      {
        path: 'mis-creditproposalbsu-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal/mis-report-credit-proposal.module').then(m => m.MisCreditProposalReportModule),
      },
      {
        path: 'mis-cpfacility-report',
        loadChildren: () =>
          import('./mis-report/credit-proposa-facility/mis-report-credit-proposal-facility.module').then(
            m => m.MisReportCreditProposalFacilityModule
          ),
      },
      {
        path: 'mis-cptimeline-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal-timeline-summary/mis-report-credit-proposal-timeline-summary.module').then(
            m => m.MisCreditProposalTimelineSummaryModule
          ),
      },
      {
        path: 'mis-cpcrotimeline-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal-timeline/mis-report-credit-proposal-timeline.module').then(
            m => m.MisCreditProposalTimelineModule
          ),
      },
      {
        path: 'mis-cpdeviation-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal-deviation/mis-report-credit-proposal-deviation.module').then(
            m => m.MisReportCreditProposalDeviationModule
          ),
      },
      {
        path: 'mis-cp-sladppk-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal-credam-dppk/mis-report-credit-proposal-credam.module').then(
            m => m.MisReportCreditProposalCredamModule
          ),
      },
      {
        path: 'mis-appraisal-report',
        loadChildren: () => import('./mis-report/mis-appraisal/mis-appraisal.module').then(m => m.MisAppraisalModule),
      },
      {
        path: 'mis-appraisal-report-bsu',
        loadChildren: () => import('./mis-report/mis-appraisal-bsu/mis-appraisal-bsu.module').then(m => m.MisAppraisalBsuModule),
      },
      {
        path: 'mis-cpslareviewer-report',
        loadChildren: () => import('./mis-report/sla-reviewer/mis-cpslareviewer-report.module').then(m => m.MisCpslaReviewerReportModule),
      },

      {
        path: 'mis-cp-slainsurance-report',
        loadChildren: () =>
          import('./mis-report/mis-sla-credit-insurance/mis-sla-credit-insurance.module').then(m => m.MisReportSLACreditInsuranceModule),
      },
      {
        path: 'mis-creditproposal-report',
        loadChildren: () => import('./mis-report/mis-cp/mis-cp.module').then(m => m.MisReportCreditProposalModule),
      },
      {
        path: 'mis-legalclor-report',
        loadChildren: () =>
          import('./mis-report/mis-credit-legal-or/mis-credit-legal-or.component.module').then(m => m.MisCreditLegalOrModule),
      },
      {
        path: 'mis-cpcompare-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal-compare/mis-report-credit-proposal-compare.module').then(
            m => m.MisCreditProposalReportCompareModule
          ),
      },
      {
        path: 'mis-cp-credit-insurance-report',
        loadChildren: () =>
          import('./mis-report/credit-proposal-insurance-report/credit-proposal-insurance-report.module').then(
            m => m.CreditProposalInsuranceReportModule
          ),
      },
      {
        path: 'mis-cp-slaloanops-report',
        loadChildren: () =>
          import('./mis-report/mis-cp-slaloanops-report/mis-cp-slaloanops-report.module').then(m => m.MisCpSlaloanopsReportModule),
      },
      {
        path: 'mis-legalclho-report',
        loadChildren: () => import('./mis-report/mis-credit-legal-ho/mis-credit-legal-ho.module').then(m => m.MisCreditLegalHoModule),
      },
      {
        path: 'mis-cp-dashboard-credam',
        loadChildren: () =>
          import('./mis-report/dashboard-credam-department/dashboard-main-credam-department.module').then(
            m => m.MisDashboardCredamDepartmentModule
          ),
      },
      {
        path: 'mis-legaladmla-report',
        loadChildren: () =>
          import('./mis-report/mis-laporan-admin-legal/mis-laporan-admin-legal.module').then(m => m.MisReportLaporanAdminLegalModule),
      },
      {
        path: 'check-validation',
        loadChildren: () => import('./mis-report/mis-appraisal/mis-appraisal.module').then(m => m.MisAppraisalModule),
      },
      {
        path: 'mis-cp-dashboard-legal',
        loadChildren: () => import('./mis-report/dashboard-legal/dashboard-legal.module').then(m => m.DashboardLegalModule),
      },
      {
        path: 'mis-croyearly-report',
        loadChildren: () =>
          import('./mis-report/mis-summary-approval-yearly/mis-summary-approval-yearly.module').then(m => m.MisSummaryApprovalYearlyModule),
      },
      {
        path: 'mis-lglsummaryappr-report',
        loadChildren: () =>
          import('./mis-report/mis-summary-approval-regional-lc/mis-summary-approval-regional-lc.module').then(
            m => m.MisReportSummaryApprovalRegionalLCModule
          ),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
