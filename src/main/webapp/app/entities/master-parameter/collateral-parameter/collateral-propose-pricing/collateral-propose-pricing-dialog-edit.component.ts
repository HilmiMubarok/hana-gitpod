import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICollateralProposePricingParam } from './propose-pricing-parameter.model';
import { MessageService } from 'primeng/api';
import { CollateralProposePricingParameterService } from './propose-pricing-parameter.service';
import { CollateralParameterService } from '../collateral-parameter.service';
import { ICollateralParameter } from '../collateral-parameter.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-collateral-propose-pricing-dialog-edit',
  templateUrl: './collateral-propose-pricing-dialog-edit.component.html',
})
export class CollateralProposePricingDialogEditComponent implements OnInit {
  public collateralProposePricingParameter: ICollateralProposePricingParam;
  public collateralParameter: ICollateralProposePricingParam;
  public view: boolean;
  public dataCollateral: ICollateralParameter;

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
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProposePricingParameter: ICollateralProposePricingParam;
      dataCollateral: ICollateralParameter;
      view: false;
    },
    private _dialog: MatDialogRef<CollateralProposePricingDialogEditComponent>,
    protected collateralParameterService: CollateralParameterService,
    protected collateralProposePricingService: CollateralProposePricingParameterService,
    protected messageService: MessageService
  ) {
    _dialog.disableClose = true;
    this.collateralProposePricingParameter = this.data.collateralProposePricingParameter;
    this.dataCollateral = this.data.dataCollateral;
    this.view = this.data.view;
  }
  ngOnInit(): void {
    this.collateralProposePricingParameter.collateralParameterId = this.dataCollateral.id;
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
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
