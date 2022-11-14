import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralAppraisal } from '../collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from '../collateral-appraisal/collateral-appraisal.service';
import { ICollateral } from '../collateral/collateral.model';
import { ICollateralProperty } from './collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-result-list',
  templateUrl: './collateral-property-result-list.component.html',
})
export class CollateralPropertyResultListComponent implements OnInit {
  public dataSource: ICollateralAppraisal[];
  public collateral: ICollateral;
  public displayColumns: string[] = [
    'no',
    'appraisalNumber',
    'appraisalDate',
    'appraisalType',
    'institution',
    'marketValue',
    'liquidationValue',
    'action',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { collateral: ICollateral },
    private collateralApprraisalService: CollateralAppraisalService
  ) {
    this.collateral = this.data.collateral;
  }

  ngOnInit(): void {
    console.log('ini collateral', this.collateral);
    this.getDataResult();
  }

  getDataResult() {
    this.collateralApprraisalService
      .queryFilterBy({ idCollateral: this.collateral.id, size: 9999, page: 0, sort: ['desc'] })
      .subscribe(res => {
        console.log('hasil filter', res.body);
        this.dataSource = res.body;
      });
  }
}
