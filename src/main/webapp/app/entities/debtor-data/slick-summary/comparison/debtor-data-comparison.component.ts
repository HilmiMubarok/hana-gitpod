import { Component, Input, OnInit } from '@angular/core';

import { IPartyCif } from 'app/entities/party-cif/party-cif.model';

import { IComparison } from './comparison.mode';
@Component({
  selector: 'jhi-debtor-data-slik-summary-comparison',
  templateUrl: './debtor-data-comparison.component.html',
  styleUrls: ['../slik.css'],
})
export class DebtorDataSlikSummaryComparisonComponent implements OnInit {
  public loading: boolean;
  public data: IComparison;

  private _partyCif: IPartyCif;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  constructor() {}

  ngOnInit(): void {
    this.data = this.partyCif.debtorData.attributes['comparison'];
  }
}
