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
import { OfferingLetterSignerPageComponent } from './offering-page/signer/signer-page.component';
import { OfferingLetterSignerPageDialogComponent } from './offering-page/signer/dialog/signer-page-dialog.component';
import { OfferingLetterOfferingPageComponent } from './offering-page/offering-page.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(OfferingLetterRoute)],
  declarations: [
    OfferingLetterComponent,
    OfferingLetterMainComponent,
    OfferingLetterSignerPageComponent,
    OfferingLetterSignerPageDialogComponent,
    OfferingLetterOfferingPageComponent,
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwOfferingLetterModule {}
