import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { IDocumentChecklistDebtorData, DocumentChecklistDebtorData } from './debtor-data-document-checklist';
import { DebtorDataDocumentChecklistDialogComponent } from './debtor-data-document-checklis-dialog.component';
import { IDebtorData } from '../debtor-data.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import lodash from 'lodash';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import * as JSZip from 'jszip';
import { DatePipe } from '@angular/common';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
@Component({
  selector: 'jhi-deptor-data-document-checklist',
  templateUrl: './document-checklis-deptor-data.component.html',
  styleUrls: ['./document.scss'],
})
export class DeptorDataDocumentChecklistComponent implements OnInit {
  public files: any[];
  public bucket: string;
  public searchCifInput: string;
  private _partyCif: IDebtorData;
  private dataKey: any;
  public folders = [];
  public typeData: IDocumentType[];
  public type2: IDocumentType[];
  public file = [];
  public fileUrl = [];
  datePipe: DatePipe = new DatePipe('en-US');
  public dataArray: IDocumentType[];
  constructor(
    private storageService: StorageService,
    public dialog: MatDialog,
    private documentTypeService: DocumentTypeService,
    private messageService: MessageService,
    private partyCifService: PartyCifService
  ) {}
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(item: IDebtorData) {
    this._partyCif = item;
  }

  ngOnInit(): void {
    this.partyCifService.findCollateral(this.partyCif.customerNumber, 'R201').subscribe((find: any) => {
      const Investoris = find.body;
      this.getBucket().then(() => {
        this.getFiles(this.partyCif.customerNumber).then(() => {
          this.documentTypeService.documentTypeList('DOC_IDD').subscribe((res: any) => {
            this.documentTypeService.documentTypeList('DOC_COLL').subscribe((res1: any) => {
              this.typeData = [...res.body, ...res1.body];

              const colllateralKapal = this.partyCif.collaterals.filter(
                (data: any) =>
                  data.attributes.collateralCode === 'AN0206' &&
                  data.statusId !== 'CANCEL' &&
                  data.statusId !== 'RELEASE' &&
                  data.statusId !== 'EXISTING'
              );
              const nonKeuangan = this.partyCif.collaterals.filter(
                (data: any) =>
                  data.attributes.collateralCode === 'AN0299' &&
                  data.statusId !== 'CANCEL' &&
                  data.statusId !== 'RELEASE' &&
                  data.statusId !== 'EXISTING'
              );

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
                } else if (this.typeData[i].id.includes('COR')) {
                  this.typeData[i].collateralTypeId = 'COR';
                } else if (this.typeData[i].id.includes('IND')) {
                  this.typeData[i].collateralTypeId = 'IND';
                }
              }

              const filterStatus: ICollateral[] = this.partyCif.collaterals.filter(
                data => data.statusId !== 'CANCEL' && data.statusId !== 'RELEASE' && data.statusId !== 'EXISTING'
              );
              const collateralData: IDocumentType[] = this.typeData.filter(obj1 =>
                filterStatus.map(obj2 => obj2.collateralTypeId).includes(obj1.collateralTypeId)
              );
              const INDCORData: IDocumentType[] = this.typeData.filter(
                obj => obj.customerType === this.partyCif.customerType && obj.id !== 'DOC_IDD_BINDING'
              );
              const PengikatKredit: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_IDD_BINDING');

              const InvestorisData = Investoris ? this.typeData.filter(obj => obj.id.includes('COLL_STOCK')) : [];
              const nonKeuanganData = nonKeuangan.length > 0 ? this.typeData.filter(obj => obj.id.includes('PIUTG')) : [];
              const colllateralKapalData = colllateralKapal.length > 0 ? this.typeData.filter(obj => obj.id.includes('SHIP')) : [];
              const DocumentLainnya: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_IDD_OTHER');

              const result: IDocumentType[] = [
                ...collateralData,
                ...INDCORData,

                ...PengikatKredit,
                ...InvestorisData,
                ...nonKeuanganData,
                ...colllateralKapalData,
                ...DocumentLainnya,
              ];

              for (let i = 0; i < result.length; i++) {
                this.documentTypeService.documentTypeList(result[i].id).subscribe((re: any) => {
                  result[i].level = re.body;
                  console.log('re.body', re.body);

                  const mergeArray: ILevel[] = result[i].level.map(item1 => {
                    const file = this.file.find(item2 => item2.idFile === item1.id);
                    return { ...item1, ...file };
                  });

                  const personalCorporate = mergeArray.filter(obj => obj.customerType === this.partyCif.customerType);
                  const nullData = mergeArray.filter(obj => obj.customerType === 'ALL');

                  result[i].level = [...personalCorporate, ...nullData];

                  this.dataArray = result;
                  console.log('re.body', this.dataArray);
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

  public donwload() {
    this.getBucket().then(() => {
      this.getFiles(this.partyCif.customerNumber).then(() => {
        const zip = new JSZip.default();
        async function downloadFile(url: string): Promise<ArrayBuffer> {
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          return buffer;
        }
        const downloadPromises = this.fileUrl.map(async (file, index) => {
          try {
            if (!file.name.includes('los_logo.png')) {
              const fileContent = await downloadFile(file.url);
              zip.file(file.name, fileContent);
            }
          } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'file failed to download' });
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
      const predicate: Object = {
        key: `/idd/${id}/document/`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe((res: any) => {
        this.fileUrl = res.body;
        for (let index = 0; index < res.body.length; index++) {
          this.file = [
            ...this.file,
            {
              idFile: res.body[index].tags.id,
              url: res.body[index].url,
              name: res.body[index].key,
              remarks: res.body[index].tags.remarks,
              status: res.body[index].tags.status,
              dueDate: res.body[index].tags.dueDate,
            },
          ];
        }
        resolve();
      });
    });
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace(/codeSpecialDan/g, '&');
    } else {
      return '';
    }
  }

  public openDialog(element: IDocumentType = null, view: string, item: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['partyId'] = this.partyCif.customerNumber;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = element;
    predicate.data['typeData'] = this.typeData;
    predicate.data['view'] = view;
    predicate.data['item'] = item;

    const dialogRef = this.dialog.open(DebtorDataDocumentChecklistDialogComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {});
  }
}
