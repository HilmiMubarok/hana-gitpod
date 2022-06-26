import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyPaymentPrefComponent } from './party-payment-pref.component';
import { PartyPaymentPrefDetailComponent } from './party-payment-pref-detail.component';
import { PartyPaymentPrefUpdateComponent } from './party-payment-pref-update.component';
import { partyPaymentPrefRoute } from './party-payment-pref.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyPaymentPrefRoute)],
  declarations: [PartyPaymentPrefComponent, PartyPaymentPrefDetailComponent, PartyPaymentPrefUpdateComponent],
  entryComponents: [PartyPaymentPrefComponent, PartyPaymentPrefUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyPaymentPrefModule {}
