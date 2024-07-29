import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { OfferingLetterComponent } from './offering-letter.component';
import { OfferingLetterMainComponent } from './offering-letter-main.component';
import { OfferingLetterRoute } from './offering-letter.route';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreditProposalResolve } from '../credit-proposal/credit-proposal.route';

import { OfferingLetterOfferingPageComponent } from './offering-page/offering-page.component';
import { OfferingLetterTabCovenantComponent } from './covenant-document/offering-letter-tab-covenant.component';
import { OfferingLetterTabCovenantDeviationComponent } from './covenant-deviation/offering-letter-tab-covenant-deviation.component';
import { CompareApprovalReportComponent } from './compare-approval-report/compare-approval-report.component';
import { CertificateInfoDialogComponent } from './certificate-info/certificate-info-dialog.component';
import { CovenantModule } from '../credit-proposal/convenant/covenant.module';
import { RiskAcceptanceCriteriaModule } from '../credit-proposal/risk-criteria/risk-acceptance-criteria.module';
import { LoanFacilityModule } from '../credit-proposal/loan-facility/loan-facility.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { ManagementInfoModule } from '../credit-proposal/management-info/management-info.module';
import { BusinessActivityModule } from '../credit-proposal/busines-activity/business-activity.module';
import { SlikMainModule } from '../loan-analys/slik/slik-main.module';
import { ProposePricingModule } from '../credit-proposal/propose-pricing/propose-pricing.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { TradeCheckingModule } from '../credit-proposal/trade-checking/trade-checking.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    CovenantModule,
    RiskAcceptanceCriteriaModule,
    LoanFacilityModule,
    ExposureModule,
    ManagementInfoModule,
    BusinessActivityModule,
    SlikMainModule,
    ProposePricingModule,
    MemoBandingModule,
    TradeCheckingModule,
    RouterModule.forChild(OfferingLetterRoute),
  ],
  declarations: [
    OfferingLetterComponent,
    OfferingLetterMainComponent,
    OfferingLetterOfferingPageComponent,
    OfferingLetterTabCovenantComponent,
    OfferingLetterTabCovenantDeviationComponent,
    CompareApprovalReportComponent,
    CertificateInfoDialogComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOfferingLetterModule {}
