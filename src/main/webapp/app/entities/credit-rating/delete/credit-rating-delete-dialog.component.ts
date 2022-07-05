import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreditRating } from '../credit-rating.model';
import { CreditRatingService } from '../service/credit-rating.service';

@Component({
  templateUrl: './credit-rating-delete-dialog.component.html',
})
export class CreditRatingDeleteDialogComponent {
  creditRating?: ICreditRating;

  constructor(protected creditRatingService: CreditRatingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.creditRatingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
