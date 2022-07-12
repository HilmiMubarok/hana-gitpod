import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PartyPostalAddressComponent } from './party-postal-address.component';
import { PartyPostalAddressDetailComponent } from './party-postal-address-detail.component';
import { PartyPostalAddressUpdateComponent } from './party-postal-address-update.component';
import { partyPostalAddressRoute } from './party-postal-address.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyPostalAddressRoute)],
  declarations: [PartyPostalAddressComponent, PartyPostalAddressDetailComponent, PartyPostalAddressUpdateComponent],
  entryComponents: [PartyPostalAddressComponent, PartyPostalAddressUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPartyPostalAddressModule {}
