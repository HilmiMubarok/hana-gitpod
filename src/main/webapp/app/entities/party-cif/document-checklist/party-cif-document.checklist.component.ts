import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'jhi-party-cif-document-checklist',
  templateUrl: './party-cif-document-checklist.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifDocumentChecklistComponent {
  private _partyCif: Object;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(item: Object) {
    this._partyCif = item;
  }
}
