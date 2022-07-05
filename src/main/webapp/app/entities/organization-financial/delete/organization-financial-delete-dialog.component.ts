import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganizationFinancial } from '../organization-financial.model';
import { OrganizationFinancialService } from '../service/organization-financial.service';

@Component({
  templateUrl: './organization-financial-delete-dialog.component.html',
})
export class OrganizationFinancialDeleteDialogComponent {
  organizationFinancial?: IOrganizationFinancial;

  constructor(protected organizationFinancialService: OrganizationFinancialService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organizationFinancialService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
