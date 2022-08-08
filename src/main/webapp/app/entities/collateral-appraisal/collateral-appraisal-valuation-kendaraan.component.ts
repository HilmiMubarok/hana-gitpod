import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-kendaraan',
  templateUrl: './collateral-appraisal-valuation-kendaraan.component.html',
})
export class CollateralAppraisalValuationKendaraanComponent {
  public data: any = [];
  public dataDropdown: any = [];
  public fields: Object = {
    text: 'name',
    value: 'id',
  };
}
