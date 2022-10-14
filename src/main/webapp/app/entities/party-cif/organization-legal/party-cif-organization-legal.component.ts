import { Component, OnInit, Input } from '@angular/core';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-party-cif-organization-legal',
  templateUrl: './party-cif-organization-legal.component.html',
})
export class PartyCifOrganizationLegalComponent {
  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(param: IPartyCif) {
    this._partyCif = param;
  }

  constructor(public partyCifService: PartyCifService) {}
}
