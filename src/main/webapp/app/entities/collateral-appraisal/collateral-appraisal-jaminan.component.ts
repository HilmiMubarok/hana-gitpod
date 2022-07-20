import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-jaminan',
  templateUrl: './collateral-appraisal-jaminan.component.html',
})
export class CollateralAppraisalJaminanComponent implements OnInit {
  @Input() partyId: number;

  public collateralApprisalPartyId: number;

  constructor() {}

  ngOnInit(): void {
    // this.collateralApprisalPartyId = this.partyId;
    this.collateralApprisalPartyId = 52;
  }
}
