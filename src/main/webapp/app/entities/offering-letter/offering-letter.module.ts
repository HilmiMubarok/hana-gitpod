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

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(OfferingLetterRoute)],
  declarations: [OfferingLetterComponent, OfferingLetterMainComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOfferingLetterModule {}
