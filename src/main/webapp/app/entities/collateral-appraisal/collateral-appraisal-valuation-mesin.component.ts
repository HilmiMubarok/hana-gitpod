import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-mesin',
  templateUrl: './collateral-appraisal-valuation-mesin.component.html',
})
export class CollateralAppraisalValuationMesinComponent {
  public data: any = [];
  public dataDropdown: any = [];
  public fields: Object = {
    text: 'name',
    value: 'id',
  };
}
