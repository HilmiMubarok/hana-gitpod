import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-management-data',
  templateUrl: './management-data-list.component.html',
})
export class PartyCifManagementDataComponent implements OnChanges {
  private _partyCif: IPartyCif;
  public validation = false;
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

  public needToReload() {
    console.log('ini sebelum', this.validation);
    this.validation = !this.validation;
    console.log('ini sesudah', this.validation);
  }
}
