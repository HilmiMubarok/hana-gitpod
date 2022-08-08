import { Component } from '@angular/core';
import { ICollateral, Collateral } from '../collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-unit-condition',
  templateUrl: './collateral-appraisal-process-detail-unit-condition.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDetailProcessUnitConditionComponent {
  public item: ICollateral = new Collateral();
}
/* export class CollateralAppraisalDetailProcessUnitConditionComponent implements OnInit {
  public item: ICollateral = new Collateral();

  constructor(private collateralService: CollateralService) {}

  ngOnInit(): void {
    this.getData();
  }

  saveCollateral() {
    this.collateralService.save(this.item).subscribe(response => console.log(response));
  })

  getData() {
    this.collateralService.query().subscribe((res: HttpResponse<ICollateral[]>) => {
      console.log('body collaterall', res.body);
    });
  }
}*/
