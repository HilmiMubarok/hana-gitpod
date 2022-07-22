import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-valuation',
  templateUrl: './collateral-appraisal-valuation.component.html',
})
export class CollateralAppraisalValuationComponent {
  public data: any = [];
  public dataDropdown: any = [];
  public fields: Object = {
    text: 'name',
    value: 'id',
  };

  /* public pageSettings: PageSettingsModel = {
    pageSizes: true,
    pageSize: 6,
  };

  public dataDropdown: {[key: string]: Object;}[] = [
    {
      id: '1',
      name: 'Item 1',
    },
    {
      id: '2',
      name: 'Item 2',
    },
  ];*/
}
