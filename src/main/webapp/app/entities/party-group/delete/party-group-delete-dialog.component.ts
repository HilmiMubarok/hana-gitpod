import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPartyGroup } from '../party-group.model';
import { PartyGroupService } from '../service/party-group.service';

@Component({
  templateUrl: './party-group-delete-dialog.component.html',
})
export class PartyGroupDeleteDialogComponent {
  partyGroup?: IPartyGroup;

  constructor(protected partyGroupService: PartyGroupService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.partyGroupService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
