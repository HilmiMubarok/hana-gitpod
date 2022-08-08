import { Component } from '@angular/core';
import { ICollateral, Collateral } from '../collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-mesin',
  templateUrl: './collateral-appraisal-process-detail-mesin.component.html',
  styleUrls: ['./collateral-appraisal.css'],
})
export class CollateralAppraisalDetailProcessMesinComponent {
  public item: ICollateral = new Collateral();
}

/* export class CollateralAppraisalDetailProcessMesinComponent implements OnInit {
  public item: ICollateral = new Collateral();

  constructor(private collateralService: CollateralService) {}
  ngOnInit(): void {
    this.getData();
  }

  saveCollateral() {
    this.collateralService.save(this.item).subscribe(response => console.log(response));
  }

  getData() {
    this.collateralService.query().subscribe((res: HttpResponse<ICollateral[]>) => {
      console.log('body collaterall', res.body);
    });
  }
}*/
