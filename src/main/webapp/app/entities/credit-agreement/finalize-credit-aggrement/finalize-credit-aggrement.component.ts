import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-finalize-credit-aggrement',
  templateUrl: './finalize-credit-aggrement.component.html',
  styleUrls: ['../credit-agreement.css'],
})
export class FinalizeCreditAggrementComponent {
  public data = [];
  public loading: boolean;
  constructor() {
    this.loading = false;
  }

  public displayColumns = ['No', 'Name', 'Debitor', 'Position', 'Action'];
  public displayColumnsDraftPerjanjianKredit = ['no', 'fileName', 'date', 'createdBy', 'sizeFile', 'action'];
}
