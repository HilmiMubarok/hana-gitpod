import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationManagement } from '../organization-management.model';
import { OrganizationManagementService } from '../service/organization-management.service';

@Component({
  templateUrl: './organization-management-delete-dialog.component.html',
})
export class OrganizationManagementDeleteDialogComponent {
  organizationManagement?: IOrganizationManagement;

  constructor(protected organizationManagementService: OrganizationManagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationManagementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
