import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICollateralProposePricingParam } from './propose-pricing-parameter.model';
import { MessageService } from 'primeng/api';
import { CollateralProposePricingParameterService } from './propose-pricing-parameter.service';
import { CollateralParameterService } from '../collateral-parameter.service';
import { ICollateralParameter } from '../collateral-parameter.model';

@Component({
  selector: 'jhi-collateral-propose-pricing-dialog-edit',
  templateUrl: './collateral-propose-pricing-dialog-edit.component.html',
})
export class CollateralProposePricingDialogEditComponent implements OnInit {
  public collateralProposePricingParameter: ICollateralProposePricingParam;
  public view: boolean;
  public param: ICollateralParameter;

  public statusValue = [
    {
      statusId: 'ACTIVE',
      statusDescription: 'Active',
      statusCode: 'ACTIVE',
    },
    {
      statusId: 'NON_ACTIVE',
      statusDescription: 'Non Active',
      statusCode: 'NON_ACTIVE',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProposePricingParameter: ICollateralProposePricingParam;
      view: false;
    },
    private _dialog: MatDialogRef<CollateralProposePricingDialogEditComponent>,
    protected collateralParameterService: CollateralParameterService,
    protected collateralProposePricingService: CollateralProposePricingParameterService,
    protected messageService: MessageService
  ) {
    this.collateralProposePricingParameter = this.data.collateralProposePricingParameter;
    this.view = this.data.view;
  }
  ngOnInit(): void {
    this.findValueById(this.collateralProposePricingParameter);
  }

  // Untuk Kebutuhan Add Data
  public findValueById(param: ICollateralParameter) {
    this.collateralProposePricingService.filterTableData(param.id).subscribe(result => {
      console.log('result', result);
      if (result.body.length) {
        for (let i = 0; i < result.body.length; i++) {
          this.collateralProposePricingParameter.collateralParameterId = result.body[i].collateralParameterId;
        }
      }
    });
  }
  public save() {
    if (this.collateralProposePricingParameter.id) {
      // update
      if (this.collateralProposePricingParameter.id) {
        this.collateralProposePricingService.update(this.collateralProposePricingParameter).subscribe(res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
          this._dialog.close(res.body);
        });
      }
    } else {
      if (this.collateralProposePricingParameter.id) {
        // create
        this.collateralProposePricingService.create(this.collateralProposePricingParameter).subscribe(res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
          this._dialog.close(res.body);
        });
      }
    }
  }
}
