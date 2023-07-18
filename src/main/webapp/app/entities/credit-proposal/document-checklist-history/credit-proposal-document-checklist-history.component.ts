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
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
@Component({
  selector: 'jhi-document-checklist-history',
  templateUrl: './credit-proposal-document-checklist-history.component.html',
  styleUrls: ['./document.scss'],
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
  constructor(
    private storageService: StorageService,
    public dialog: MatDialog,
    private documentTypeService: DocumentTypeService,
    private partyCifService: PartyCifService
  ) {}
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
    this.partyCifService.findCollateral(this.creditProposal.cif.customerId, 'R201').subscribe((find: any) => {
      const Investoris = find.body;
      const colllateralKapal = this.creditProposal.collaterals.filter(
        (data: any) =>
          data.attributes.collateralCode === 'AN0206' &&
          data.statusId !== 'CANCEL' &&
          data.statusId !== 'RELEASE' &&
          data.statusId !== 'EXISTING'
      );
      const nonKeuangan = this.creditProposal.collaterals.filter(
        (data: any) =>
          data.attributes.collateralCode === 'AN0299' &&
          data.statusId !== 'CANCEL' &&
          data.statusId !== 'RELEASE' &&
          data.statusId !== 'EXISTING'
      );
      const eArcLoanForegn = [];
      const eArcLoan = [];
      for (let i = 0; i < this.creditProposal.products.length; i++) {
        if (this.creditProposal.products[i].productName === 'Working Capital - eARC Loan(Foreign)') {
          eArcLoanForegn.push(this.creditProposal.products[i]);
        }

        if (this.creditProposal.products[i].productName === 'Working Capital - eARC Loan') {
          eArcLoan.push(this.creditProposal.products[i]);
        }
      }
      const jaminanFactoring = eArcLoanForegn.length > 0 || eArcLoan.length > 0 ? true : false;

      if (this.creditProposal.attributes['collateralAfterData']) {
        while (typeof this.creditProposal.attributes['collateralAfterData'] === 'string') {
          this.creditProposal.attributes['collateralAfterData'] = JSON.parse(this.creditProposal.attributes['collateralAfterData']);
        }
      } else {
        this.creditProposal.attributes['collateralAfterData'] = [];
      }

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
                  } else if (this.typeData[i].id.includes('VH')) {
                    this.typeData[i].collateralTypeId = 'VEHICLE';
                  } else if (this.typeData[i].id.includes('GRNT')) {
                    this.typeData[i].collateralTypeId = 'CORPORATEPERSONALGUARANTEE';
                  } else if (this.typeData[i].id.includes('DOC_CP_COLL_OTHER') || this.typeData[i].id.includes('DOC_COLL_OTHER')) {
                    this.typeData[i].collateralTypeId = 'OTHER';
                  } else if (this.typeData[i].id.includes('COR')) {
                    this.typeData[i].collateralTypeId = 'COR';
                  } else if (this.typeData[i].id.includes('IND')) {
                    this.typeData[i].collateralTypeId = 'IND';
                  }
                }
                const filterStatus: ICollateral[] = this.creditProposal.collaterals.filter(obj => obj.statusCode !== 'CANCEL');
                const collateralData: IDocumentType[] = this.typeData.filter(obj1 =>
                  filterStatus.map(obj2 => obj2.collateralTypeId).includes(obj1.collateralTypeId)
                );
                const INDCORData: IDocumentType[] = this.typeData.filter(obj => obj.customerType === this.creditProposal.customerType);
                const PersetujuanKredit: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_AGGR');
                const PengikatKredit: IDocumentType[] = this.typeData.filter(
                  obj => obj.id === 'DOC_CP_BINDING' || obj.id === 'DOC_IDD_BINDING'
                );
                const DocumentLainnya: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_IDD_OTHER');
                const DocumentLainnyaIdentitasDebiturPerorangan: IDocumentType[] = this.typeData.filter(
                  obj => obj.id === 'DOC_CP_OTHER_ID'
                );

                const takeOverData =
                  this.creditProposal.attributes['facilityTakeOver'].length > 0
                    ? this.typeData.filter(obj => obj.id === 'DOC_CP_COLL_TO')
                    : [];
                const InvestorisData = Investoris ? this.typeData.filter(obj => obj.id.includes('COLL_STOCK')) : [];
                const colllateralKapalData = colllateralKapal.length > 0 ? this.typeData.filter(obj => obj.id.includes('SHIP')) : [];
                const jaminanFactoringData = jaminanFactoring ? this.typeData.filter(obj => obj.id.includes('COLL_EARC')) : [];
                const nonKeuanganData = nonKeuangan.length > 0 ? this.typeData.filter(obj => obj.id.includes('PIUTG')) : [];
                const result: IDocumentType[] = [
                  ...collateralData,
                  ...INDCORData,
                  ...PersetujuanKredit,
                  ...PengikatKredit,
                  ...DocumentLainnya,
                  ...DocumentLainnyaIdentitasDebiturPerorangan,
                  ...takeOverData,
                  ...InvestorisData,
                  ...colllateralKapalData,
                  ...jaminanFactoringData,
                  ...nonKeuanganData,
                ];

                for (let i = 0; i < result.length; i++) {
                  this.documentTypeService.documentTypeList(result[i].id).subscribe((re: any) => {
                    result[i].level = re.body;

                    const mergeArray: ILevel[] = result[i].level.map(item1 => {
                      const file = this.file.find(item2 => item2.idFile === item1.id);
                      return { ...item1, ...file };
                    });

                    const personalCorporate = mergeArray.filter(obj => obj.customerType === this.creditProposal.customerType);
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
