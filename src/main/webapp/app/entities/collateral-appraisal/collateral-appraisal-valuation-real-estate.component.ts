import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-real-estate',
  templateUrl: './collateral-appraisal-valuation-real-estate.component.html',
})
export class CollateralAppraisalValuationRealEstateComponent {
  public data: any = [];
  public dataDropdown: any = [];
  public fields: Object = {
    text: 'name',
    value: 'id',
  };
}
