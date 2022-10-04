import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-management-data',
  templateUrl: './management-data-list.component.html',
})
export class PartyCifManagementDataComponent implements OnChanges {
  private _partyCif: IPartyCif;

  @Input()
  get partyCif() {
    return this._partyCif;
  }
  set partyCif(param: IPartyCif) {
    this._partyCif = param;
  }

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif']) {
      console.log('hello world');
    }
  }
}
