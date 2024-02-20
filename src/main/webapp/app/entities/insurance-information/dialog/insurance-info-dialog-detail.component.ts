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
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { InsuranceInformationService } from '../insurance-information.service';
import { MessageService } from 'primeng/api';

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
  public insuranceType;
  mode: any;
  public logoIdr = { prefix: 'IDR ', thousands: ',', decimal: '.', precision: 0 };
  dataInsuranceDeviation = false;

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
    this.insurance = this.data.insurance;
    this.mode = this.data.mode;
    this.insurance.collateralId = this.collateral.id;
  }
  ngOnInit(): void {
    this.lovInsuranceType();
    this.lovDocumentPolicy();
    this.cekCurrency();
    this.insuranceDeviation();
  }
  public save() {
    if (this.insurance.insuranceCategoryId === 36501) {
      if (!this.insurance.insuranceCategoryId) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Insurance Type terlebih dahulu', life: 3000 });
        return;
      }
      if (!this.insurance.documentPolicyId) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Document Policy terlebih dahulu', life: 3000 });
        return;
      }
      if (!this.insurance.attributes['remarks']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Remarks terlebih dahulu', life: 3000 });
        return;
      }
    } else {
      if (!this.insurance.insuranceCategoryId) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Insurance Type terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.companyName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Company Name terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.attributes['policyNumber']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Policy Number terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.currencyId) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Currency terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.currencyValue) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Kurs terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.coverageValue) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Coverage Value terlebih dahulu', life: 3000 });
        return;
      }

      if (this.insurance.bankerClause !== true && this.insurance.bankerClause !== false) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Banker Clause terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.documentPolicyId) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Document Policy terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.brokerCompany) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Broker Company terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.thruDate) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Date terlebih dahulu', life: 3000 });
        return;
      }

      if (this.insurance.paymentStatus !== true && this.insurance.paymentStatus !== false) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Pilih Payment Status terlebih dahulu', life: 3000 });
        return;
      }

      if (!this.insurance.attributes['remarks']) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Masukkan Remarks terlebih dahulu', life: 3000 });
        return;
      }
    }
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
        if (this.documentPolicye) {
          let elements: string;
          for (let i = 0; i < this.documentPolicye.length; i++) {
            if (this.insurance.documentPolicyId === this.documentPolicye[i].id) {
              elements = this.documentPolicye[i].value;
            }
          }
          this.insurance.documentPolicyDescription = elements;
        }
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
        if (this.insuranceType) {
          let element: string;
          for (let i = 0; i < this.insuranceType.length; i++) {
            if (this.insurance.insuranceCategoryId === this.insuranceType[i].id) {
              element = this.insuranceType[i].value;
            }
          }
          this.insurance.insuranceCategoryDescription = element;
        }
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
  // validate insurance

  // condition Insurance Deviation

  public insuranceDeviation() {
    if (this.insurance) {
      if (this.insurance.insuranceCategoryId === 36501) {
        this.dataInsuranceDeviation = true;
      } else {
        this.dataInsuranceDeviation = false;
      }
    }
  }
}
