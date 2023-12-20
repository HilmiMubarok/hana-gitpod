import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import {
  IDocumentChecklistDebtorData,
  DocumentChecklistDebtorData,
} from 'app/entities/debtor-data/document-checklis/debtor-data-document-checklist';

import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import lodash from 'lodash';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';

import { ICollateral } from 'app/entities/collateral/collateral.model';
import * as JSZip from 'jszip';
import { DatePipe } from '@angular/common';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { Router } from '@angular/router';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { InsuranceDocumentDialogComponent } from './insurance-document-dialog.component';
import { InsuranceInformation } from '../insurance-information.model';
@Component({
  selector: 'jhi-insurance-document',
  templateUrl: './insurance-document.component.html',
  styleUrls: ['./insurance-document.style.scss'],
})
export class InsuranceDocumentComponent implements OnInit {
  public files: any[];
  public bucket: string;
  public searchCifInput: string;
  private _creditProposal: IDebtorData;
  private dataKey: any;
  public folders = [];
  public typeData: IDocumentType[];
  public type2: IDocumentType[];
  public file = [];
  public file1 = [];
  public file2 = [];
  public fileUrl = [];
  public collateralProperty: any;
  public dataArray: IDocumentType[];
  public matrix: boolean;
  public _isViewMode: boolean;
  datePipe: DatePipe = new DatePipe('en-US');
  debtorData: IDebtorData;
  collateral: ICollateral;
  data: any;
  insurance: InsuranceInformation;
  constructor(
    private storageService: StorageService,
    public dialog: MatDialog,
    private documentTypeService: DocumentTypeService,
    public partyCifService: PartyCifService,
    public router: Router
  ) {}
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input()
  get isViewMode() {
    return this._isViewMode;
  }

  set isViewMode(item: boolean) {
    this._isViewMode = item;
  }

  public checkMatrixLA() {
    if (
      this.router.url.includes('la-analyst') ||
      this.router.url.includes('la-SME-CRC') ||
      this.router.url.includes('la-approval') ||
      this.router.url.includes('loan-committee-approval') ||
      this.router.url.includes('dar-final')
    ) {
      this.matrix = true;
    } else {
      this.matrix = false;
    }
  }

  ngOnInit(): void {
    this.getBucket().then(val => {
      this.getFiles(`/debtor/${this.debtorData.id}/collateral/${this.collateral.id}/insurance/${this.insurance.id}/documents/`);
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }

  public donwload() {
    this.getBucket().then(() => {
      this.getFiles(String(this.creditProposal.id)).then(() => {
        const zip = new JSZip.default();
        async function downloadFile(url: string): Promise<ArrayBuffer> {
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          return buffer;
        }
        const downloadPromises = this.fileUrl.map(async (file, index) => {
          try {
            const nameFile = file.name.split('/').length === 5 ? file.name.split('/')[4] : file.name.split('/')[5];
            if (!nameFile.includes('los_logo.png')) {
              const fileContent = await downloadFile(file.url);
              zip.file(nameFile, fileContent);
            }
          } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error);
          }
        });

        Promise.all(downloadPromises).then(() => {
          zip.generateAsync({ type: 'blob' }).then(content => {
            // Membuat objek URL untuk file zip
            const url = URL.createObjectURL(content);

            // Membuat elemen <a> untuk mengunduh file
            const link = document.createElement('a');
            link.href = url;
            link.download = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + '-' + 'file-donwload.zip';

            // Simulasikan klik pada elemen <a> untuk mengunduh file
            link.click();

            // Hapus objek URL setelah selesai mengunduh
            URL.revokeObjectURL(url);
          });
        });
      });
    });
  }

  public openDialog(element: IDocumentType = null, view: string, item: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['cp'] = this.creditProposal;
    predicate.data['cpId'] = this.creditProposal.id;
    predicate.data['partyId'] = this.creditProposal.customerNumber;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = element;
    predicate.data['typeData'] = this.typeData;
    predicate.data['view'] = view;
    predicate.data['item'] = item;

    const dialogRef = this.dialog.open(InsuranceDocumentDialogComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {
      // if (r !== 'save') {
      // }
    });
  }

  private getFiles(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const retriveDataInsuranceDocument: Object = {
        key: `/debtor/${this.debtorData.id}/collateral/${this.collateral.id}/insurance/${id}/documents/`,
      };
      this.storageService.getObjects(this.bucket, retriveDataInsuranceDocument).subscribe((res: any) => {
        // if (res.body.length > 0) {
        //   for (let index = 0; index < res.body.length; index++) {
        //     this.file1 = [
        //       ...this.file1,
        //       {
        //         idFile: res.body[index].tags.id,
        //         url: res.body[index].url,
        //         name: res.body[index].key,
        //         remarks: res.body[index].tags.remarks,
        //         status: res.body[index].tags.status,
        //         dueDate: res.body[index].tags.dueDate,
        //       },
        //     ];
        //   }
        // }
        // resolve();
        this.data = res.body;
      });
      console.log('data', this.data);
    });
  }
}
