import { Component, Input } from '@angular/core';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-business-group',
  templateUrl: './party-cif-business-group.component.html',
})
export class PartyCifBusinessGroupComponent {
  private _partyCif: IPartyCif;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(param: IPartyCif) {
    this._partyCif = param;
  }

  constructor() {}
}
