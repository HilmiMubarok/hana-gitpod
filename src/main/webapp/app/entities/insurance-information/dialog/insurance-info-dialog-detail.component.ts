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
import { IInsuranceInformation, InsuranceInformation } from '../insurance-information.model';
import { INSURANCE_INFORMATION, PARIPASU_STATUS } from 'app/shared/constants/status.constants';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { IInsurance } from 'app/entities/party-cif/insurance-information-idd/insurance-information.model';
import { InsuranceInformationService } from '../insurance-information.service';
import { MessageService } from 'primeng/api';
import { leftRight } from '@syncfusion/ej2-angular-grids';

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
  selector: 'jhi-insurance-info-dialog-detail',
  templateUrl: './insurance-info-dialog-detail.component.html',
  styleUrls: ['./insurance-info-dialog.css'],
})
export class InsuranceInfoDialogDetailComponent implements OnInit {
  public paripasuStatus: any;
  public parentSource = '';
  public field = false;
  public parentPath = this.router.url.split('/')[1];
  creditProposal: ICreditProposal;
  collateral: ICollateral;
  isViewMode: Boolean = false;
  collateralTypes: ICollateralType[];
  insurance: InsuranceInformation;
  creditProposalOpenState: any;
  public documentPolicye = [];
  setDate: string;
  currencyName: number;
  public preCurent = '';
  public optionCcy: string[] = ['IDR', 'USD'];
  public conCcy = false;
  public logoCcy;
  cursIdr: any;
  ccy: string;
  public insuranceType = [];
  mode: any;
  paymentStatus: any;
  public logoIdr = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  constructor(
    protected messageService: MessageService,
    public creditProposalService: CreditProposalService,
    private router: Router,
    private dialog: MatDialog,
    protected generalParameterService: GeneralParameterService,
    private _dialog: MatDialogRef<InsuranceInfoDialogDetailComponent>,
    private insuranceInformationService: InsuranceInformationService,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      cp: ICreditProposal;
      collateral: ICollateral;
      isViewMode: boolean;
      parentSource: string;
      mode;
      insurance: IInsuranceInformation;
    }
  ) {
    this.creditProposal = this.data.cp;
    this.collateral = this.data.collateral;
    this.isViewMode = this.data.isViewMode;
    this.parentSource = this.data.parentSource;
    this.paripasuStatus = INSURANCE_INFORMATION;
    this.paymentStatus = INSURANCE_INFORMATION;
    this.insurance = this.data.insurance;
    this.mode = this.data.mode;

    console.log('insuranceConstructor', this.insurance);
  }

  ngOnInit(): void {
    this.lovInsuranceType();
    this.lovDocumentPolicy();
    this.cekCurrency();
  }

  public save() {
    this._dialog.close(this.insurance);
  }
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
  public lovDocumentPolicy() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_DOCUMENT_POLICY',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.documentPolicye = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });

        console.log('documentPolicy', this.documentPolicye);
      });
  }
  public lovInsuranceType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'INSURANCE_CATEGORY',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.insuranceType = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        console.log('insuranceType', this.insuranceType);
      });
  }
  changeCurrency(value: string) {
    this.ccy = value;
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency(value, 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.currencyName = res.body[0]?.factor;
      this.insurance.currencyValue = res.body[0]?.factor;
      if (this.preCurent === '') {
        if (value === 'IDR') {
          this.conCcy = true;
          this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
          this.preCurent = 'IDR';
        } else if (value === 'USD') {
          this.conCcy = true;
          this.logoCcy = {};
          this.preCurent = 'USD';
        }
      } else if (this.preCurent === 'IDR') {
        if (value === '') {
          this.conCcy = false;
          this.preCurent = '';
        } else if (value === 'USD') {
          this.conCcy = true;
          this.logoCcy = {};
          this.insurance.coverageValueInIDR = this.insurance.coverageValueInIDR / this.currencyName;
          this.preCurent = 'USD';
        }
      } else if (this.preCurent === 'USD') {
        if (value === '') {
          this.conCcy = false;
          this.preCurent = '';
        } else if (value === 'IDR') {
          this.conCcy = true;
          this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
          this.getCurs();
          this.preCurent = 'IDR';
        }
      }
    });
  }
  public changeCollateralCoverage() {
    const coverangeEq = this.insurance.coverageValue * this.insurance.currencyValue;
    this.insurance.coverageValueInIDR = coverangeEq;
    return coverangeEq;
  }
  public cekCurrency() {
    if (this.insurance.currencyId === 'IDR') {
      this.logoCcy = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
    }
    if (this.insurance.currencyId === 'USD') {
      this.logoCcy = {};
    }
  }
  getCurs() {
    this.setDate = new Date().toISOString().split('T')[0];
    this.creditProposalService.getCurrency('USD', 'IDR', this.setDate.replace(/-/g, '')).subscribe(res => {
      this.cursIdr = res.body[0]?.factor;
      this.insurance.coverageValueInIDR = this.insurance.coverageValueInIDR * this.cursIdr;
    });
  }
}
