import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditProposalCollateralInfoComponent } from './credit-proposal-collateral-info.component';
import { AboveGridComponent } from './above-grid/above-grid.component';
import { BellowGridComponent } from './bellow-grid/bellow-grid.component';
import { CreditProposalCollateralInfoBTPComponent } from './backtoback/credit-proposal-collateral-info-btb.component';
import { DialogCreditProposalCollateralInfoDialogBTBComponent } from './backtoback/dialog-credit-proposal-collateral-info-btb.component';
import { BindingValueInformationComponent } from './binding-value-information/binding-value-information.component';
import { CreditProposalCollateralInfoRemarksInformationComponent } from './remarks/credit-proposal-collateral-info-remarks-information.component';
import { BindingValueInformationGridComponent } from './binding-value-information/binding-value-information-grid/binding-value-information-grid.component';
import { BindingValueInformationDialogComponent } from './binding-value-information/binding-value-information-dialog/binding-value-information-dialog.component';
import { BindingValueGeneralGridComponent } from './binding-value-information/binding-value-information-dialog/binding-value-general-grid/binding-value-general-grid.component';
import { BindingValueGeneralDialogComponent } from './binding-value-information/binding-value-information-dialog/binding-value-general-grid/binding-value-general-dialog.component';
import { CreditProposalCollateralInfoChecklistComponent } from './checklist/credit-proposal-collateral-info-checklist.component';
import { SummaryGridComponent } from './collateral-summary/summary-grid.component';
import { CreditProposalCollateralSummaryDialogComponent } from './collateral-summary/credit-proposal-collateral-summary-dialog.component';
import { CreditProposalCollateralInfoDialogComponent } from './dialog/credit-proposal-collateral-info-dialog.component';
import { GroupCollateralListCpComponent } from './group-collateral/group-collateral-list-cp.component';
import { GroupCollateralComponent } from './group-collateral/group-collateral.component';
import { ParipasuCollateralDebiturComponent } from './paripasu-collateral-debitur/paripasu-collateral-debitur.component';
import { ParipasuCollateralGroupComponent } from './paripasu-collateral-group/paripasu-collateral-group.component';
import { ParipasuCollateralComponent } from './paripasu-collateral/paripasu-collateral.component';
import { CreditProposalCollateralInfoRemarksChecklistComponent } from './remarks/credit-proposal-collateral-info-remarks-checklist.component';
import { CreditProposalCollateralInfoRemarksComponent } from './remarks/credit-proposal-collateral-info-remarks.component';
import { BindingValueRealEstateDialogComponent } from './binding-value-information/binding-value-information-dialog/binding-value-real-estate-grid/binding-value-real-estate-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    // collateral info
    CreditProposalCollateralInfoComponent,
    AboveGridComponent,
    BellowGridComponent,
    CreditProposalCollateralInfoDialogComponent,
    CreditProposalCollateralInfoBTPComponent,
    DialogCreditProposalCollateralInfoDialogBTBComponent,
    // binding value information
    BindingValueInformationComponent,
    BindingValueInformationGridComponent,
    BindingValueInformationDialogComponent,
    BindingValueGeneralGridComponent,
    BindingValueGeneralDialogComponent,
    BindingValueRealEstateDialogComponent,
    // checklist
    CreditProposalCollateralInfoChecklistComponent,
    // collateral Summary
    SummaryGridComponent,
    CreditProposalCollateralSummaryDialogComponent,
    // group collateral
    GroupCollateralComponent,
    GroupCollateralListCpComponent,
    // paripasu
    ParipasuCollateralComponent,
    ParipasuCollateralDebiturComponent,
    ParipasuCollateralGroupComponent,
    // remarks
    CreditProposalCollateralInfoRemarksChecklistComponent,
    CreditProposalCollateralInfoRemarksComponent,
    CreditProposalCollateralInfoRemarksInformationComponent,
  ],
  exports: [
    // collateral info
    CreditProposalCollateralInfoComponent,
    AboveGridComponent,
    BellowGridComponent,
    CreditProposalCollateralInfoDialogComponent,
    CreditProposalCollateralInfoBTPComponent,
    DialogCreditProposalCollateralInfoDialogBTBComponent,
    // binding value information
    BindingValueInformationComponent,
    BindingValueInformationGridComponent,
    BindingValueInformationDialogComponent,
    BindingValueGeneralGridComponent,
    BindingValueGeneralDialogComponent,
    BindingValueRealEstateDialogComponent,
    // checklist
    CreditProposalCollateralInfoChecklistComponent,
    // collateral Summary
    SummaryGridComponent,
    CreditProposalCollateralSummaryDialogComponent,
    // group collateral
    GroupCollateralComponent,
    GroupCollateralListCpComponent,
    // paripasu
    ParipasuCollateralComponent,
    ParipasuCollateralDebiturComponent,
    ParipasuCollateralGroupComponent,
    // remarks
    CreditProposalCollateralInfoRemarksChecklistComponent,
    CreditProposalCollateralInfoRemarksComponent,
    CreditProposalCollateralInfoRemarksInformationComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class CollateralInfoCpModule {}
