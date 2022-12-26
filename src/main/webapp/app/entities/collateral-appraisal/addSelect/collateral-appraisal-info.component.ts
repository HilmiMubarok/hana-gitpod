import { Component, ViewChild, Input } from '@angular/core';
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-appraisal-info-new',
  templateUrl: './collateral-appraisal-info.component.html',
  styleUrls: ['./collateral-appraisal-data-nasabah.css'],
})
export class CollateralAppraisalNewInfoComponent {
 public _collateral: ICollateral

 @Input()
    get collateral(){
        return this._collateral
    }

    set collateral(item: ICollateral){
        this._collateral = item
    }
}
