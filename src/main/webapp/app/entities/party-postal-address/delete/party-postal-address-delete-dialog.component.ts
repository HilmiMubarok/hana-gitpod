import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPartyPostalAddress } from '../party-postal-address.model';
import { PartyPostalAddressService } from '../service/party-postal-address.service';

@Component({
  templateUrl: './party-postal-address-delete-dialog.component.html',
})
export class PartyPostalAddressDeleteDialogComponent {
  partyPostalAddress?: IPartyPostalAddress;

  constructor(protected partyPostalAddressService: PartyPostalAddressService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partyPostalAddressService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
