import { Component, Input, OnInit } from '@angular/core';

import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-facility-info-cif',
  templateUrl: './facility-info-cif.component.html',
})
export class FacilityInfoCifComponent implements OnInit {
  public loading: boolean;

  constructor(public partyCifService: PartyCifService) {}
  public data = [];

  private _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  ngOnInit(): void {
    this.loadDataBy();
  }

  public loadDataBy(): void {
    this.partyCifService.find('cif/retrieve-cp-facility/' + this.partyCif.customerNumber).subscribe((res: any) => {
      this.data = JSON.parse(res.body.debtorData.attributes['cpFacility']);
    });
  }
}
