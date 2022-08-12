import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';

@Component({
  selector: 'jhi-collateral-appraisal-jaminan',
  templateUrl: './collateral-appraisal-jaminan.component.html',
})
export class CollateralAppraisalJaminanComponent {
  @Input() partyCif: IPartyCif;
  @Output() outputSelectedCheckBoxCollateral = new EventEmitter();

  public onSelectCheckBoxCollateralChanged(ev): void {
    this.outputSelectedCheckBoxCollateral.emit(ev);
  }
}
