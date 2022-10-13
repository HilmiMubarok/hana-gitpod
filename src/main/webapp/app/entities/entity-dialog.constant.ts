import { CollateralAppraisalComparisonDialogComponent } from './collateral-appraisal/comparison/collateral-appraisal-comparison-dialog.component';
import { CollateralAppraisalNegativeCollateralDialogComponent } from './collateral-appraisal/negative/dialog/negative-collateral-dialog.component';
import { CollateralPropertyMarketValueDialogComponent } from './collateral-property/collateral-property-market-value-dialog.component';
import { CreditProposalBankAccountAnalystDialogComponent } from './credit-proposal/bank-account-analyst/bank-account-analyst-dialog.component';
import { CorrespondenceDialogComponent } from './credit-proposal/correspondence/correspondence-dialog.component';
import { CustomerGroupDialogComponent } from './customer-group/customer-group-dialog.component';
import { DocumentDetailDialogComponent } from './document/document-detail-dialog.component';
import { DocumentUploadDialogComponent } from './document/document-upload-dialog.component';
import { OrganizationLegalDialogComponent } from './organization-legal/organization-legal-dialog.component';
import { OrganizationManagementDialogComponent } from './organization-management/organization-management-dialog.component';

export const entityDialogModule: any[] = [
  CollateralAppraisalComparisonDialogComponent,
  CollateralAppraisalNegativeCollateralDialogComponent,
  OrganizationManagementDialogComponent,
  CustomerGroupDialogComponent,
  OrganizationLegalDialogComponent,
  DocumentUploadDialogComponent,
  DocumentDetailDialogComponent,
  CorrespondenceDialogComponent,
  CollateralPropertyMarketValueDialogComponent,
  CreditProposalBankAccountAnalystDialogComponent,
];
