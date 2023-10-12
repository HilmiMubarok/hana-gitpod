import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-finalize-credit-agreement',
  templateUrl: './finalize-credit-agreement.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class FinalizeCreditAgreementComponent {
  public data = [];
  public loading: boolean;
  constructor() {
    this.loading = false;
  }

  public displayColumns = ['No', 'Name', 'Debitor', 'Position', 'Action'];
  public displayColumnsDraftPerjanjianKredit = ['no', 'fileName', 'date', 'createdBy', 'sizeFile', 'action'];
}
