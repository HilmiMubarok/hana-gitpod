import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import {
  IDocumentChecklistDebtorData,
  DocumentChecklistDebtorData,
} from 'app/entities/debtor-data/document-checklis/debtor-data-document-checklist';
import { DocumentChecklistDialogHistoryComponent } from './document-checklist-dialog-history.component';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import lodash from 'lodash';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
import { ICreditProposal } from '../credit-proposal.model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import * as JSZip from 'jszip';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'jhi-document-checklist-history',
  templateUrl: './credit-proposal-document-checklist-history.component.html',
})
export class CreditProposalDocumentChecklistHistoryComponent implements OnInit {
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
  public file3 = [];
  public fileUrl = [];
  public dataArray: IDocumentType[];
  public parsedData: any;
  datePipe: DatePipe = new DatePipe('en-US');
  constructor(private storageService: StorageService, public dialog: MatDialog, private documentTypeService: DocumentTypeService) {}
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  @Input() isViewMode: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  public historyData() {
    // if isOnCompare and not isCompareDar, then set dynamic data to previousReturn
    if (this.isOnCompareData && !this.isCompareDar) {
      return this.parsedData.previousReturn;
    } else if (this.isOnCompareData && this.isCompareDar) {
      // return dataDar
      return {
        collaterals: this.creditProposal.collaterals,
        insurance: this.creditProposal.attributes.insurance,
        binding: this.creditProposal.attributes.binding,
        creditProposalCollateralData: this.creditProposal.attributes.creditProposalCollateralData,
        products: this.creditProposal.products,
      };
    } else {
      return this.parsedData.previousHistory;
    }
  }

  ngOnInit(): void {
    this.parsedData = parsePreviousAtrribute(this.creditProposal);
    this.getBucket().then(() => {
      this.getFiles(String(this.creditProposal.id)).then(() => {
        this.documentTypeService.documentTypeList('DOC_IDD').subscribe((res: any) => {
          this.documentTypeService.documentTypeList('DOC_CP').subscribe((res1: any) => {
            this.documentTypeService.documentTypeList('DOC_COLL').subscribe((res2: any) => {
              this.typeData = [...res.body, ...res1.body, ...res2.body];
              for (let i = 0; i < this.typeData.length; i++) {
                if (this.typeData[i].id.includes('DEPO')) {
                  this.typeData[i].collateralTypeId = 'DEPOSIT';
                } else if (this.typeData[i].id.includes('RE')) {
                  this.typeData[i].collateralTypeId = 'REALESTATE';
                } else if (this.typeData[i].id.includes('MC')) {
                  this.typeData[i].collateralTypeId = 'MACHINE';
                } else if (this.typeData[i].id.includes('SHIP')) {
                  this.typeData[i].collateralTypeId = 'MACHINE';
                } else if (this.typeData[i].id.includes('VH')) {
                  this.typeData[i].collateralTypeId = 'VEHICLE';
                } else if (this.typeData[i].id.includes('GRNT')) {
                  this.typeData[i].collateralTypeId = 'CORPORATEPERSONALGUARANTEE';
                } else if (this.typeData[i].id.includes('DOC_CP_COLL_OTHER') || this.typeData[i].id.includes('DOC_COLL_OTHER')) {
                  this.typeData[i].collateralTypeId = 'OTHER';
                } else if (this.typeData[i].id.includes('STOCK')) {
                  this.typeData[i].collateralTypeId = 'PERSONAL_PROPERTY';
                } else if (this.typeData[i].id.includes('PIUTG')) {
                  this.typeData[i].collateralTypeId = 'PERSONAL_PROPERTY';
                } else if (this.typeData[i].id.includes('COR')) {
                  this.typeData[i].collateralTypeId = 'COR';
                } else if (this.typeData[i].id.includes('IND')) {
                  this.typeData[i].collateralTypeId = 'IND';
                }
              }
              const filterStatus: ICollateral[] = this.historyData().collaterals.filter(obj => obj.statusCode !== 'CANCEL');
              const collateralData: IDocumentType[] = this.typeData.filter(obj1 =>
                filterStatus.map(obj2 => obj2.collateralTypeId).includes(obj1.collateralTypeId)
              );
              const INDCORData: IDocumentType[] = this.typeData.filter(obj => obj.customerType === this.creditProposal.customerType);
              const PersetujuanKredit: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_AGGR');
              const PengikatKredit: IDocumentType[] = this.typeData.filter(
                obj => obj.id === 'DOC_CP_BINDING' || obj.id === 'DOC_IDD_BINDING'
              );
              const DocumentLainnya: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_IDD_OTHER');
              const DocumentLainnyaIdentitasDebiturPerorangan: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_OTHER_ID');
              const result: IDocumentType[] = [
                ...collateralData,
                ...INDCORData,
                ...PersetujuanKredit,
                ...DocumentLainnya,
                ...PengikatKredit,
                ...DocumentLainnyaIdentitasDebiturPerorangan,
              ];

              for (let i = 0; i < result.length; i++) {
                this.documentTypeService.documentTypeList(result[i].id).subscribe((re: any) => {
                  result[i].level = re.body;

                  const mergeArray: ILevel[] = result[i].level.map(item1 => {
                    const file = this.file.find(item2 => item2.idFile === item1.id);
                    return { ...item1, ...file };
                  });

                  const personalCorporate = mergeArray.filter(obj => obj.customerType === this.historyData().customerType);
                  const nullData = mergeArray.filter(obj => obj.customerType === 'ALL');

                  result[i].level = [...personalCorporate, ...nullData];

                  this.dataArray = result;
                });
              }
            });
          });
        });
      });
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

  public openDialog(element: IDocumentType = null, view: string, item: string, parentId: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['cpId'] = this.creditProposal.id;
    predicate.data['partyId'] = this.creditProposal.id;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = element;
    predicate.data['typeData'] = this.typeData;
    predicate.data['view'] = view;
    predicate.data['item'] = item;
    predicate.data['parentId'] = parentId;

    const dialogRef = this.dialog.open(DocumentChecklistDialogHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {});
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
            const fileContent = await downloadFile(file.url);
            zip.file(nameFile, fileContent);
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

  private getFiles(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dataCpOnly: Object = {
        key: `/cp/${id}/document/history/file-idd/`,
      };

      const dataIDDOnly: Object = {
        key: `/cp/${id}/document/history/file-cp/`,
      };
      this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => {
        for (let index = 0; index < res1.body.length; index++) {
          this.file2 = [
            ...this.file2,
            {
              idFile: res1.body[index].tags.id,
              url: res1.body[index].url,
              name: res1.body[index].key,
              remarks: res1.body[index].tags.remarks,
              status: res1.body[index].tags.status,
              dueDate: res1.body[index].tags.dueDate,
            },
          ];
        }

        this.storageService.getObjects(this.bucket, dataIDDOnly).subscribe((res2: any) => {
          for (let index = 0; index < res2.body.length; index++) {
            this.file3 = [
              ...this.file3,
              {
                idFile: res2.body[index].tags.id,
                url: res2.body[index].url,
                name: res2.body[index].key,
                remarks: res2.body[index].tags.remarks,
                status: res2.body[index].tags.status,
                dueDate: res2.body[index].tags.dueDate,
              },
            ];
          }

          this.file = [...this.file2, this.file3];
          this.fileUrl = this.file;
          resolve();
        });
      });
    });
  }
}
