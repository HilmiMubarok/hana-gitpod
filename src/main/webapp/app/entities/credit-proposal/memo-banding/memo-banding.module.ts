import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CpMemoBandingLoanFacilityComponent } from './memo-banding-loan-facility/cp-memo-banding-loan-facility.component';
import { MemoBandingCollateralAboveBeforeComponent } from './memo-banding-collateral/above/cp-memo-banding-collateral-above-before.component';
import { CpMemoBandingCollateralAboveComponent } from './memo-banding-collateral/above/cp-memo-banding-collateral-above.component';
import { MemoBandingCollateralBackToBackBeforeComponent } from './memo-banding-collateral/backtoback/cp-memo-banding-collateral-backtoback-before.component';
import { CPMemoBandingCollateralBacktobackComponent } from './memo-banding-collateral/backtoback/cp-memo-banding-collateral-backtoback.component';
import { CpMemoBandingCollateralComponent } from './memo-banding-collateral/cp-memo-banding-collateral.component';
import { CPMemoBandingStandardCovenantComponent } from './memo-banding-covenant/cp-memo-banding-standard-covenant.component';
import { CPMemoBandingCovenantAboveComponent } from './memo-banding-covenant/above/cp-memo-banding-covenant-above.component';
import { CPMemoBandingCovenantBelowComponent } from './memo-banding-covenant/below/cp-memo-banding-covenant-below.component';
import { CPMemoBandingCovenantBackToBackDepositComponent } from './memo-banding-covenant/back-to-back/cp-memo-banding-covenant-back-to-back-deposit.component';
import { CPMemoBandingCovenantBackToBackGeneralComponent } from './memo-banding-covenant/back-to-back/cp-memo-banding-covenant-back-to-back-general.component';
import { CpMemoBandingOtherCovenantComponent } from './memo-banding-covenant/other-covenant/cp-memo-banding-other-covenant.component';
import { CPMemoBandingRemarkComponent } from './remarks/cp-memo-banding-remark.component';
import { MemoBandingComponent } from './credit-proposal-memo-banding.component';
import { CountMVOriginalPipe } from './memo-banding-collateral/pipes/count-mv-original.pipe';
import { GetCurrencyPipe } from './memo-banding-collateral/pipes/get-currency.pipe';
import { CountMVPipe } from './memo-banding-collateral/pipes/count-mv.pipe';
import { CustomPercentagePipe } from './memo-banding-collateral/pipes/percentage.pipe';
import { CountLVPipe } from './memo-banding-collateral/pipes/count-lv.pipe';
import { CountKjjpMvPipe } from './memo-banding-collateral/pipes/count-kjjp-mv.pipe';
import { CountKjjpLvPipe } from './memo-banding-collateral/pipes/count-kjjp-lv.pipe';
import { GetMarketabilityPipe } from './memo-banding-collateral/pipes/get-marketability.pipe';
import { GetOwnershipPipe } from './memo-banding-collateral/pipes/get-ownership.pipe';
import { GetExpiryPipe } from './memo-banding-collateral/pipes/get-expiry.pipe';
import { GetBindingTypePipe } from './memo-banding-collateral/pipes/get-binding-type.pipe';

@NgModule({
  declarations: [
    MemoBandingComponent,
    CpMemoBandingLoanFacilityComponent,
    CpMemoBandingCollateralComponent,
    MemoBandingCollateralAboveBeforeComponent,
    CpMemoBandingCollateralAboveComponent,
    MemoBandingCollateralBackToBackBeforeComponent,
    CPMemoBandingCollateralBacktobackComponent,
    CPMemoBandingStandardCovenantComponent,
    CPMemoBandingCovenantAboveComponent,
    CPMemoBandingCovenantBelowComponent,
    CPMemoBandingCovenantBackToBackDepositComponent,
    CPMemoBandingCovenantBackToBackGeneralComponent,
    CpMemoBandingOtherCovenantComponent,
    CPMemoBandingRemarkComponent,

    // PIPES
    CountMVOriginalPipe,
    GetCurrencyPipe,
    CountMVPipe,
    CustomPercentagePipe,
    CountLVPipe,
    CountKjjpMvPipe,
    CountKjjpLvPipe,
    GetMarketabilityPipe,
    GetOwnershipPipe,
    GetExpiryPipe,
    GetBindingTypePipe,
  ],
  imports: [SharedModule],
  exports: [
    MemoBandingComponent,
    CpMemoBandingLoanFacilityComponent,
    CpMemoBandingCollateralComponent,
    MemoBandingCollateralAboveBeforeComponent,
    CpMemoBandingCollateralAboveComponent,
    MemoBandingCollateralBackToBackBeforeComponent,
    CPMemoBandingCollateralBacktobackComponent,
    CPMemoBandingStandardCovenantComponent,
    CPMemoBandingCovenantAboveComponent,
    CPMemoBandingCovenantBelowComponent,
    CPMemoBandingCovenantBackToBackDepositComponent,
    CPMemoBandingCovenantBackToBackGeneralComponent,
    CpMemoBandingOtherCovenantComponent,
    CPMemoBandingRemarkComponent,

    // PIPES
    CountMVOriginalPipe,
    GetCurrencyPipe,
    CountMVPipe,
    CustomPercentagePipe,
    CountLVPipe,
    CountKjjpMvPipe,
    CountKjjpLvPipe,
    GetMarketabilityPipe,
    GetOwnershipPipe,
    GetExpiryPipe,
    GetBindingTypePipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MemoBandingModule {}
