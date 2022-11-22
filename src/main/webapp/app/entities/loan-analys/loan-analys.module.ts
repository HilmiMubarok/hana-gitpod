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
import { LoanAnalysOpinionComponent } from './opinion/loan-analys-opinion.component';
import { LoanAnalysDialogOpinionComponent } from './dialogs/loan-analys-dialog-opinion.component';
import { LoanFacilityDetailTempComponent } from './dar-final-temp/loan-facility/credit-proposal-tab-loan-facility-detail.component';
import { LoanFacilityDetailGridTempComponent } from './dar-final-temp/loan-facility/grid/credit-proposal-tab-loan-facility-detail.grid.component';
import { LoanFacilityDialogTempComponent } from './dar-final-temp/loan-facility/dialog/loan-facility-dialog.component';
import { CreditProposalMappingCollateralTempComponent } from './dar-final-temp/loan-facility/mapping/mapping-collateral.component';
import { CollateralInfoTempComponent } from './dar-final-temp/collateral-info/credit-proposal-collateral-info.component';
import { BellowGridTempComponent } from './dar-final-temp/collateral-info/bellow-grid/bellow-grid.component';
import { CollateralInfoDialogTempComponent } from './dar-final-temp/collateral-info/dialog/collateral-info-dialog-temp.component';
import { MappingFacilityTempComponent } from './dar-final-temp/loan-facility/mapping/mapping-facility.component';
import { ParipasuCollateralTempComponent } from './dar-final-temp/collateral-info/paripasu-collateral/paripasu-collateral.component';
import { CovenantTempComponent } from './dar-final-temp/convenant/credit-proposal-tab-covenant.component';
import { OtherCovenantTempComponent } from './dar-final-temp/convenant/other-covenant/credit-proposal-other-covenant.component';
import { OtherCovenantTempDialogComponent } from './dar-final-temp/convenant/other-covenant/add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditTempComponent } from './dar-final-temp/convenant/other-covenant/edit/credit-proposal-other-covenant-edit.component';
import { CreditProposalCovenantBelowTempComponent } from './dar-final-temp/convenant/below/credit-proposal-covenant-below.component';
import { CreditProposalDeviationBelowTempComponent } from './dar-final-temp/convenant/below/deviation/credit-proposal-deviation-below.component';
import { DocumentChecklistTempComponent } from './dar-final-temp/document-checklist/credit-proposal-document-checklist.component';
import { DocumentChecklistDialogTempComponent } from './dar-final-temp/document-checklist/document-checklist-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(LoanAnalysRoute)],
  declarations: [
    LoanAnalysComponent,
    LoanAnalysMComponent,
    LoanAnalysMainComponent,
    LoanAnalysBatchBulkAssignComponent,
    LoanAnalysSlikMainComponent,
    LoanFacilityDetailTempComponent,
    LoanFacilityDetailGridTempComponent,
    LoanFacilityDialogTempComponent,
    CreditProposalMappingCollateralTempComponent,
    CollateralInfoTempComponent,
    BellowGridTempComponent,
    CollateralInfoDialogTempComponent,
    MappingFacilityTempComponent,
    ParipasuCollateralTempComponent,
    CovenantTempComponent,
    OtherCovenantTempComponent,
    OtherCovenantTempDialogComponent,
    CreditProposalOtherCovenantEditTempComponent,
    CreditProposalCovenantBelowTempComponent,
    CreditProposalDeviationBelowTempComponent,
    DocumentChecklistTempComponent,
    DocumentChecklistDialogTempComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwLoanAnalysModule {}
