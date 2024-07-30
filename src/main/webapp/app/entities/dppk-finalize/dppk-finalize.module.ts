import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { DppkFinalizeComponent } from './dppk-finalize.component';
import { DppkFinalizeReviewRoute } from './dppk-finalize.route';
import { DppkFinalizeDetailComponent } from './dppk-finalize-detail.component';
import { FinalizeCreditAgreementModule } from '../credit-agreement/finalize-credit-agreement/finalize-credit-agreement.module';
import { ExposureModule } from '../credit-proposal/exposure/exposure.module';
import { MemoBandingModule } from '../credit-proposal/memo-banding/memo-banding.module';
import { InsuranceInformationModule } from '../insurance-information/insurance-information.module';
import { DppkAssignToModule } from './dppk-assign-to/dppk-assign-to.module';

@NgModule({
  imports: [
    SharedModule,
    SharedEntityModule,
    FinalizeCreditAgreementModule,
    ExposureModule,
    MemoBandingModule,
    InsuranceInformationModule,
    DppkAssignToModule,
    RouterModule.forChild(DppkFinalizeReviewRoute),
  ],
  declarations: [DppkFinalizeComponent, DppkFinalizeDetailComponent],
  entryComponents: [DppkFinalizeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwIDppkFinalizeModule {}
