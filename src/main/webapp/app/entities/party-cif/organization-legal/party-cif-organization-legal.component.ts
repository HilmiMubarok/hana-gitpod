import { Component, OnInit, Input } from '@angular/core';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-party-cif-organization-legal',
  templateUrl: './party-cif-organization-legal.component.html',
  styleUrls: ['../../party-cif/party-cif.style.scss'],
})
export class PartyCifOrganizationLegalComponent {
  private _partyCif: IPartyCif;
  public deedNumber: any;
  public deedDates: any;
  private _positionTypeId: string;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(param: IPartyCif) {
    this._partyCif = param;
    this.deedNumber = this._partyCif.organizationLegal.deedEstablishNum;
    this.deedDates = this._partyCif.organizationLegal.deedEstablishDate;
  }

  @Input() get positionTypeId() {
    return this._positionTypeId;
  }

  set positionTypeId(string: string) {
    this._positionTypeId = string;
  }

  constructor(public partyCifService: PartyCifService) {}
}
