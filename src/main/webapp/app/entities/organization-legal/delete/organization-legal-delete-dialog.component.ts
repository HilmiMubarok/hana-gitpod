import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationLegal } from '../organization-legal.model';
import { OrganizationLegalService } from '../service/organization-legal.service';

@Component({
  templateUrl: './organization-legal-delete-dialog.component.html',
})
export class OrganizationLegalDeleteDialogComponent {
  organizationLegal?: IOrganizationLegal;

  constructor(protected organizationLegalService: OrganizationLegalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationLegalService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
