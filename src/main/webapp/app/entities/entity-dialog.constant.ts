import { CollateralLandCertificationDialogComponent } from './collateral-appraisal/collateral/dialogs/collateral-land-certification-selection-dialog.component';
import { CollateralLandInfoDialogComponent } from './collateral-appraisal/collateral/dialogs/collateral-land-info-dialog.component';
import { CollateralAppraisalComparisonDialogComponent } from './collateral-appraisal/comparison/collateral-appraisal-comparison-dialog.component';
import { CollateralAppraisalNegativeCollateralDialogComponent } from './collateral-appraisal/negative/dialog/negative-collateral-dialog.component';
import { CollateralPropertyMarketValueDialogComponent } from './collateral-property/collateral-property-market-value-dialog.component';
import { CollateralPropertyBuildingDialogComponent } from './collateral-property/dialogs/collateral-property-building-dialog.component';
import { CollateralPropertyBuildingFloorDialogComponent } from './collateral-property/dialogs/collateral-property-building-floor-dialog.component';
import { CollateralPropertyDepositDialogComponent } from './collateral-property/dialogs/collateral-property-deposit-dialog.component';
import { CollateralPropertyGuaranteeLetterDialogComponent } from './collateral-property/dialogs/collateral-property-guarantee-letter-dialog.component';
import { CollateralPropertyLandDialogComponent } from './collateral-property/dialogs/collateral-property-land-dialog.component';
import { CollateralPropertyOtherDialogComponent } from './collateral-property/dialogs/collateral-property-other-dialog.component';
import { CollateralPropertyRealestateDialogComponent } from './collateral-property/dialogs/collateral-property-realestate-dialog.component';
import { CollateralPropertySecuritiesDialogComponent } from './collateral-property/dialogs/collateral-property-securities-dialog.component';
import { CreditProposalBankAccountAnalystDialogComponent } from './credit-proposal/bank-account-analyst/bank-account-analyst-dialog.component';
import { CorrespondenceDialogComponent } from './credit-proposal/correspondence/correspondence-dialog.component';
import { CustomerGroupDialogComponent } from './customer-group/customer-group-dialog.component';
import { DocumentDetailDialogComponent } from './document/document-detail-dialog.component';
import { DocumentUploadDialogComponent } from './document/document-upload-dialog.component';
import { OrganizationLegalDialogComponent } from './organization-legal/organization-legal-dialog.component';
import { OrganizationManagementDialogComponent } from './organization-management/organization-management-dialog.component';
import { PartyCifBusinessGroupDialogComponent } from './party-cif/business-group/party-cif-business-group-dialog.component';
import { PartyCifFindOrCreateCifDialogComponent } from './party-cif/dialogs/party-cif-find-or-create-cif-dialog.component';

export const entityDialogModule: any[] = [
  PartyCifBusinessGroupDialogComponent,
  CollateralLandCertificationDialogComponent,
  CollateralLandInfoDialogComponent,
  CollateralPropertyGuaranteeLetterDialogComponent,
  CollateralPropertyOtherDialogComponent,
  CollateralPropertyRealestateDialogComponent,
  CollateralPropertySecuritiesDialogComponent,
  CollateralPropertyBuildingFloorDialogComponent,
  CollateralPropertyBuildingDialogComponent,
  PartyCifFindOrCreateCifDialogComponent,
  CollateralPropertyDepositDialogComponent,
  CollateralPropertyLandDialogComponent,
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
