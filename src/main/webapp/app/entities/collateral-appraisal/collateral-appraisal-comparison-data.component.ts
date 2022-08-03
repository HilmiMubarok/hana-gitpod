import { Component } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-comparison-data',
  templateUrl: './collateral-appraisal-comparison-data.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalComparisonDataComponent {
  public pageSettings: PageSettingsModel = { pageCount: 2, pageSize: 5 };
}
