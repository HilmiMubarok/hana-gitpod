import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { LoanAnalysComponent } from './loan-analys.component';
import { LoanAnalysMComponent } from './loan-analys-m.component';
import { LoanAnalysMainComponent } from './loan-analys-main.component';
import { LoanAnalysBatchBulkAssignComponent } from './loan-analys-batch-bulk-assign.component';
import { LoanAnalysRoute } from './loan-analys.route';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

import { LoanAnalysSlikMainComponent } from './slik/loan-analys-slik-main.component';
import { LoanAnalysDialogOpinionComponent } from './dialogs/loan-analys-dialog-opinion.component';
import { LoanFacilityDetailTempComponent } from './dar-final/loan-facility/credit-proposal-tab-loan-facility-detail.component';
import { LoanFacilityDetailGridTempComponent } from './dar-final/loan-facility/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { LoanFacilityDialogTempComponent } from './dar-final/loan-facility/dialog/loan-facility-dialog.component';
import { CreditProposalMappingCollateralTempComponent } from './dar-final/loan-facility/mapping/mapping-collateral.component';
import { CollateralInfoDarFinalComponent } from './dar-final/collateral-info/credit-proposal-collateral-info.component';
import { BellowGridDarFinalComponent } from './dar-final/collateral-info/bellow-grid/bellow-grid.component';
import { CollateralInfoDialogTempComponent } from './dar-final/collateral-info/dialog/collateral-info-dialog-temp.component';
import { MappingFacilityTempComponent } from './dar-final/loan-facility/mapping/mapping-facility.component';
import { CovenantTempComponent } from './dar-final/convenant/credit-proposal-tab-covenant.component';
import { OtherCovenantTempComponent } from './dar-final/convenant/other-covenant/credit-proposal-other-covenant.component';
import { OtherCovenantTempDialogComponent } from './dar-final/convenant/other-covenant/add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditTempComponent } from './dar-final/convenant/other-covenant/edit/credit-proposal-other-covenant-edit.component';
import { CreditProposalCovenantBelowTempComponent } from './dar-final/convenant/below/credit-proposal-covenant-below.component';
import { CreditProposalDeviationBelowTempComponent } from './dar-final/convenant/below/deviation/credit-proposal-deviation-below.component';
import { DocumentChecklistTempComponent } from './dar-final/document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogTempComponent } from './dar-final/document-checklist/document-checklist-dialog.component';
import { AboveGridDarFinalComponent } from './dar-final/collateral-info/above-grid/above-grid.component';
import { CollateralInfoBTPDarFinalComponent } from './dar-final/collateral-info/backtoback/credit-proposal-collateral-info-btb.component';
import { CollateralInfoDialogBTBDarFinalComponent } from './dar-final/collateral-info/backtoback/dialog-credit-proposal-collateral-info-btb.component';
import { LoanAnalysGroupGuarantorAnalysisComponent } from './guarantour/loan-analys-group-guarantor-analysis.component';
import { LoanAnalysSlikSummaryComponent } from './slik-summary/loan-analys-slik-summary.component';
import { LoanAnalysCreditRatingViewComponent } from './credit-rating/loan-analys-credit-rating-view.component';
import { CreditProposalDeviationDarAboveComponent } from './dar-final/convenant/above/deviation/credit-proposal-deviation-above.component';
import { LoanAnalysFacilityDetailGridDarNotifComponent } from './dar-notif/loan-facility/grid/loan-analys-facility-detail-grid-dar-notif.component';
import { LoanAnalysFacilityDetaliMainComponent } from './dar-notif/loan-facility/loan-analys-facility-detali-main.component';
import { SharedLibsModule } from 'app/shared/shared-libs.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MainFacilityDarComponent } from './dar-final/loan-facility/main-facility/main-facility-dar.component';
import { MainFacilityChildDarComponent } from './dar-final/loan-facility/main-facility/main-facility-child-dar.component';
import { MainFacilityDialogDarComponent } from './dar-final/loan-facility/main-facility/main-facility-dialog-dar.component';
import { CreditProposalPersonalInfoAnalystComponent } from './personal-info.component';
import { LoanAnalysPreviousDarComponent } from './previous/previous-dar/loan-analys-previous-dar.component';
import { LoanAnalysPreviousProposalComponent } from './previous/previous-proposal/loan-analys-previous-proposal.component';

@NgModule({
  imports: [SharedModule, SharedLibsModule, SharedEntityModule, RouterModule.forChild(LoanAnalysRoute), MatSlideToggleModule],
  declarations: [
    LoanAnalysComponent,
    LoanAnalysMComponent,
    LoanAnalysMainComponent,
    CreditProposalPersonalInfoAnalystComponent,
    LoanAnalysBatchBulkAssignComponent,
    LoanAnalysSlikMainComponent,
    // LoanFacilityDetailTempComponent,
    // LoanFacilityDetailGridTempComponent,
    // LoanFacilityDialogTempComponent,
    // CreditProposalMappingCollateralTempComponent,
    // CollateralInfoDarFinalComponent,
    // AboveGridDarFinalComponent,
    // BellowGridDarFinalComponent,
    // CollateralInfoBTPDarFinalComponent,
    // CollateralInfoDialogBTBDarFinalComponent,
    // CollateralInfoDialogTempComponent,
    // MappingFacilityTempComponent,
    // CovenantTempComponent,
    // OtherCovenantTempComponent,
    // OtherCovenantTempDialogComponent,
    // CreditProposalOtherCovenantEditTempComponent,
    // CreditProposalCovenantBelowTempComponent,
    // CreditProposalDeviationBelowTempComponent,
    // DocumentChecklistTempComponent,
    // DocumentChecklistDialogTempComponent,
    LoanAnalysGroupGuarantorAnalysisComponent,
    LoanAnalysSlikSummaryComponent,
    LoanAnalysCreditRatingViewComponent,
    // CreditProposalDeviationDarAboveComponent,
    LoanAnalysFacilityDetailGridDarNotifComponent,
    LoanAnalysFacilityDetaliMainComponent,
    LoanAnalysPreviousDarComponent,
    LoanAnalysPreviousProposalComponent,
    // MainFacilityDarComponent,
    // MainFacilityChildDarComponent,
    // MainFacilityDialogDarComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanAnalysModule {}
