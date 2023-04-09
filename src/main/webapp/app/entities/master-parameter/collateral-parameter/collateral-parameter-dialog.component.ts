import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralParameter } from './collateral-parameter.model';
import { MessageService } from 'primeng/api';
import { CollateralParameterService } from './collateral-parameter.service';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { MatSelectChange } from '@angular/material/select';
import lodash from 'lodash';
import { STATUS_LOV_PARAMETER } from 'app/shared/constants/status.constants';

@Component({
  selector: 'jhi-collateral-parameter',
  templateUrl: './collateral-parameter-dialog.component.html',
})
export class CollateralParameterDialogComponent implements OnInit {
  public listCollateralType: any;
  public collateralParameter: ICollateralParameter;
  public view: boolean;
  public collateralCode: ICollateralParameter[];
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
      collateralParameter: ICollateralParameter;
      view: false;
    },
    private _dialog: MatDialogRef<CollateralParameterDialogComponent>,
    protected collateralParameterService: CollateralParameterService,
    protected collateralTypeService: CollateralTypeService,
    protected messageService: MessageService
  ) {
    this.collateralParameter = this.data.collateralParameter;
    this.view = this.data.view;
  }
  ngOnInit(): void {
    this.getCollateralType();
    // this.getchangeTypeCollateral();
  }
  public getCollateralType() {
    this.collateralTypeService.query().subscribe(res => {
      this.listCollateralType = res.body.filter(obj => obj.id !== 'CASH');
    });
  }

  public save() {
    if (this.collateralParameter.id) {
      // update
      this.collateralParameterService.update(this.collateralParameter).subscribe(res => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Save Success',
        });
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralParameterService.create(this.collateralParameter).subscribe(res => {
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
