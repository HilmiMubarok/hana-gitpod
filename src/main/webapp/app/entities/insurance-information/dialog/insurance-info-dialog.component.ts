import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HtmlEditorService, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IInsuranceInformation } from '../insurance-information.model';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};
@Component({
  selector: 'jhi-insurance-info-dialog',
  templateUrl: './insurance-info-dialog.component.html',
  styleUrls: ['./insurance-info-dialog.css'],
})
export class InsuranceInfoDialogComponent implements OnInit {
  public parentSource = '';
  public field = false;
  public parentPath = this.router.url.split('/')[1];
  creditProposal: ICreditProposal;
  collateral: ICollateral;
  isViewMode: Boolean = false;
  collateralTypes: ICollateralType[];
  insurances: null;
  insurance: IInsuranceInformation;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private collateralTypeService: CollateralTypeService,
    protected generalParameterService: GeneralParameterService,
    private _dialog: MatDialogRef<InsuranceInfoDialogComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      isViewMode: boolean;
      parentSource: string;
      insurance: IInsuranceInformation;
    }
  ) {
    this.insurance = this.data.insurance;
    this.creditProposal = this.data.cp;
    this.collateral = this.data.collateral;
    this.isViewMode = data.isViewMode;
    this.parentSource = data.parentSource;
    this.insurances = null;
  }
  public getDataInsurances(data: any): void {
    this.insurances = data;
  }
  ngOnInit(): void {
    this.loadCollateralType();
    console.log('insurance', this.insurance);
  }
  private loadCollateralType(): void {
    this.collateralTypeService.query().subscribe(res => {
      this.collateralTypes = res.body;
    });
  }

  // public save() {
  //   this._dialog.close({
  //     collateral: this.collateral,
  //     creditProposal: this.creditProposal,
  //   });
  // }
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
