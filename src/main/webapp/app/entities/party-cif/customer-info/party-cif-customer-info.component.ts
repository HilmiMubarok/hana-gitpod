import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info',
  templateUrl: './party-cif-customer-info.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoComponent {
  private _partyCIf: IPartyCif;

  @Input()
  get partyCif() {
    return this._partyCIf;
  }

  set partyCif(data: IPartyCif) {
    this._partyCIf = data;
  }

  constructor(protected activatedRoute: ActivatedRoute) {}
}
