import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICif } from '../cif.model';
import { CifService } from '../service/cif.service';

@Component({
  templateUrl: './cif-delete-dialog.component.html',
})
export class CifDeleteDialogComponent {
  cif?: ICif;

  constructor(protected cifService: CifService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.cifService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
