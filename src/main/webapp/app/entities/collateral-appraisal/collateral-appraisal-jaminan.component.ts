import { Component, Input } from '@angular/core';

@Component({
  selector: 'jhi-collateral-appraisal-jaminan',
  templateUrl: './collateral-appraisal-jaminan.component.html',
})
export class CollateralAppraisalJaminanComponent {
  @Input() cif: string;
}
