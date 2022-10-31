import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-retrive-info',
  templateUrl: './party-cif-retrive-info.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifRetriveInfoComponent {
  private _partyCif: IPartyCif;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(param: IPartyCif) {
    this._partyCif = param;
  }
  constructor(protected activatedRoute: ActivatedRoute) {}

  saveData() {
    console;
  }
}
