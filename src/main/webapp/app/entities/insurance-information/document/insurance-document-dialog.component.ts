import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { StorageService } from 'app/entities/storage/storage.service';
import moment from 'moment';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { AccountService } from 'app/core/auth/account.service';
import { MessageService } from 'primeng/api';
import { MatSelectChange } from '@angular/material/select';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IInsuranceInformation, InsuranceInformation } from '../insurance-information.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
import { DocumentInsurance, IDocumentInsurance } from './document-insurance.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const MY_DATE_FORMAT = {
  parse: { dateInput: { month: 'numeric', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'numeric', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'numeric' },
  },
};
class PickDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      return formatDate(date, 'yyy/MM/dd', this.locale);
    } else {
      return date.toDateString();
    }
  }
}
@Component({
  selector: 'jhi-insurance-document-dialog',
  templateUrl: './insurance-document-dialog.component.html',
  styleUrls: ['./document.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class InsuranceDocumentDialogComponent implements OnInit {
  public file = [];
  files: File[] = [];
  public view: string;
  public status: any;
  public bucket: string;
  collateral: ICollateral;
  insurance: IInsuranceInformation = new InsuranceInformation();
  insurances: IInsuranceInformation;
  documentPolicye = [];
  documentInsurance: DocumentInsurance;
  id: number;
  creditProposal: ICreditProposal;
  mode: string;
  dataDocument: string;
  filesdueDate: string;
  category: string;
  remarks: string;
  dataInsurance: any;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      view: string;
      bucket: string;
      documentInsurance: IDocumentInsurance;
      creditProposal: ICreditProposal;
      insurance: InsuranceInformation;
      collateral: ICollateral;
      mode: string;
      dataInsurance: any;
    },
    private _snackBar: MatSnackBar,
    private _dialog: MatDialogRef<InsuranceDocumentDialogComponent>,
    private storageService: StorageService,
    private messageService: MessageService,
    private accountService: AccountService,
    public reportUtilService: ReportUtilService,
    protected generalParameterService: GeneralParameterService,
    private router: Router
  ) {
    console.log('dataSource', this.dataInsurance);
    console.log('insurance', this.insurance);
    console.log('cp', this.creditProposal);
    this.mode = this.data.mode;
    this.creditProposal = this.data.creditProposal;
    this.id = this.insurance.id;
    this.insurance = this.data.insurance;
    this.view = this.data.view;
    this.documentInsurance = this.data.documentInsurance;
    this.collateral = this.data.collateral;
    this.dataInsurance = this.data.dataInsurance;
    this.bucket = this.data.bucket;
    this.mode = this.data.mode;
  }
  ngOnInit(): void {
    this.lovDocumentPolicy();
    console.log('insurance', this.documentInsurance);
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
      });
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  public donwload(event: any, name: any) {
    this.reportUtilService.downloadFileBYName(event, name.name);
  }
  public save(): void {
    if (this.files.length === 0) {
      this._snackBar.open('Choose file for upload', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
    if (!this.documentInsurance.documentType) {
      this._snackBar.open('Pilih Document Policy', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }

    if (!this.documentInsurance.category) {
      this._snackBar.open('Pilih Category', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.documentInsurance.status) {
      this._snackBar.open('Pilih Status', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.documentInsurance.remarks) {
      this._snackBar.open('Masukan Remarks', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    if (!this.documentInsurance.dueDate) {
      this._snackBar.open('Pilih Date', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
      return;
    }
    for (let i = 0; this.files.length; i++) {
      const metaData = {
        objectName: null,
        entityId: null,
        document: null,
        category: null,
        dueDate: null,
        status: null,
        remarks: null,
        createdDate: null,
        createdBy: null,
      };
      const currentDate = moment().format('YYYYMMDDHHMMSSMS');
      metaData.objectName = `/debtor/${this.creditProposal.debtorData.id}/collateral/${this.collateral.id}/insurance/${this.dataInsurance}/documents/${this.files[i].name}`;
      metaData.entityId = this.dataInsurance;
      metaData.document = this.documentInsurance.documentType;
      metaData.category = this.documentInsurance.category;
      metaData.dueDate = this.documentInsurance.dueDate;
      metaData.status = this.documentInsurance.status;
      metaData.remarks = this.documentInsurance.remarks;
      metaData.createdDate = new Date();
      const formData = new FormData();
      formData.append('file', this.files[i]);
      console.log('data', this.files);

      this.accountService.identity().subscribe(resAccount => {
        metaData.createdBy = resAccount.login;
        this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Save Success',
          });
          this._dialog.close(res);
        });
      });
    }
  }
  // cancel confrimation dialog
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
        this._dialog.close('cancel');
      }
    });
  }
}
