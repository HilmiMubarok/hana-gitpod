import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-jaminan',
  templateUrl: './collateral-appraisal-jaminan.component.html',
})
export class CollateralAppraisalJaminanComponent {
  // @Input() partyId: number;
  @Input() cif: string;

  // public collateralApprisalPartyId: number;

  constructor() {}

  // ngOnInit(): void {
  // this.collateralApprisalPartyId = this.partyId;
  // this.collateralApprisalPartyId = 52;
  // }
}
