import { Component } from '@angular/core';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-collateral-appraisal-comparison-data',
  templateUrl: './collateral-appraisal-comparison-data.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalComparisonDataComponent {
  public items: object[];
  public pageSettings: PageSettingsModel = { pageCount: 2, pageSize: 5 };
}
