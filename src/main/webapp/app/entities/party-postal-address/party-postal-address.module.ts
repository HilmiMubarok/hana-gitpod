import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PartyPostalAddressComponent } from './list/party-postal-address.component';
import { PartyPostalAddressDetailComponent } from './detail/party-postal-address-detail.component';
import { PartyPostalAddressUpdateComponent } from './update/party-postal-address-update.component';
import { PartyPostalAddressDeleteDialogComponent } from './delete/party-postal-address-delete-dialog.component';
import { PartyPostalAddressRoutingModule } from './route/party-postal-address-routing.module';

@NgModule({
  imports: [SharedModule, PartyPostalAddressRoutingModule],
  declarations: [
    PartyPostalAddressComponent,
    PartyPostalAddressDetailComponent,
    PartyPostalAddressUpdateComponent,
    PartyPostalAddressDeleteDialogComponent,
  ],
  entryComponents: [PartyPostalAddressDeleteDialogComponent],
})
export class PartyPostalAddressModule {}
