import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployment } from '../employment.model';
import { EmploymentService } from '../service/employment.service';

@Component({
  templateUrl: './employment-delete-dialog.component.html',
})
export class EmploymentDeleteDialogComponent {
  employment?: IEmployment;

  constructor(protected employmentService: EmploymentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.employmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
