import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import lodash from 'lodash';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import * as JSZip from 'jszip';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { InsuranceDocumentDialogComponent } from './insurance-document-dialog.component';
import { IInsuranceInformation, InsuranceInformation } from '../insurance-information.model';
import { DocumentInsurance, IDocumentInsurance } from './document-insurance.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
@Component({
  selector: 'jhi-insurance-document',
  templateUrl: './insurance-document.component.html',
  styleUrls: ['./insurance-document.style.scss'],
})
export class InsuranceDocumentComponent implements OnChanges {
  private _creditProposal: ICreditProposal;
  files: any[];
  bucket: any;
  view: string;
  documentInsurance: DocumentInsurance;
  private _collateral: ICollateral;
  private _insurance: InsuranceInformation;
  id: number;
  dataIdInsurance: any;
  _insuranceDoc: IDocumentInsurance;
  documentPolicye: any[];
  change: SimpleChanges;
  dataSource: IInsuranceInformation;
  insurances: any;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }
  @Input()
  get insurance() {
    return this._insurance;
  }
  set insurance(items: IInsuranceInformation) {
    this._insurance = items;
  }
  @Input() isViewMode;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }
  constructor(
    public dialog: MatDialog,
    private storageService: StorageService,
    private router: Router,
    protected generalParameterService: GeneralParameterService
  ) {
    this.files = [];
    this.lovDocumentPolicy();
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('isViewMode', changes);
    if (changes['insurance']) {
      this.dataIdInsurance = changes['insurance'].currentValue.id;
      this.insurances = changes['insurance'].currentValue;
      this.getFiles(this.dataIdInsurance);
    }
  }

  private getFiles(id: any): void {
    this.getBucket().then(() => {
      const predicate: Object = {
        key: `/debtor/${this.creditProposal.debtorData.id}/collateral/${this.collateral.id}/insurance/${id}/documents/`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        this.files = res.body;
        console.log(this.files, 'data for id:', id);
      });
    });
  }
  public openDialog(mode, element: IDocumentInsurance = null): void {
    let _insuranceDoc = new DocumentInsurance();
    // const _insurance = new InsuranceInformation();
    if (element) {
      _insuranceDoc = element;
    }
    const predicate: object = {
      width: '90vw',
      data: {
        bucket: this.bucket,
        view: this.view,
        documentInsurance: _insuranceDoc,
        collateral: this.collateral,
        dataInsurance: this.dataIdInsurance,
        insurance: this.insurances,
        creditProposal: this._creditProposal,
        mode,
      },
    };
    const dialogRef = this.dialog.open(InsuranceDocumentDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      res &&
        this.getBucket().then(res2 => {
          this.getFiles(this.dataIdInsurance);
        });
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
      });
  }
}
