import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import {
  IDocumentChecklistDebtorData,
  DocumentChecklistDebtorData,
} from 'app/entities/debtor-data/document-checklis/debtor-data-document-checklist';
import { DocumentChecklistDialogComponent } from './document-checklist-dialog.component';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import lodash from 'lodash';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
import { ICreditProposal } from '../credit-proposal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import * as JSZip from 'jszip';
import { DatePipe } from '@angular/common';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { Router } from '@angular/router';
@Component({
  selector: 'jhi-credit-proposal-document-checklist',
  templateUrl: './credit-proposal-document-checklist.component.html',
  styleUrls: ['./credit-proposal-document-checklist.style.scss'],
})
export class CreditProposalDocumentChecklistComponent implements OnInit {
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

  public hidePencilButton: Boolean = false;
  public statusHidePencilButton = ['CP_ASSIGNMENT', 'CP_CHECKER', 'CP_LOAN_APPROVAL'];

  datePipe: DatePipe = new DatePipe('en-US');
  @Input() isOnMemoBanding: Boolean = false;
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
      this.router.url.includes('dar-final') ||
      this.creditProposal.statusCode === 'DPDL_RETURN_TO_RM'
    ) {
      this.matrix = true;
    } else {
      this.matrix = false;
    }
  }

  ngOnInit(): void {
    this.statusHidePencilButton.includes(this.creditProposal.statusId) && (this.hidePencilButton = true);

    this.checkMatrixLA();
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
                this.documentTypeService.documentTypeList('DOC_LA').subscribe((res3: any) => {
                  let docLaData;

                  if (this.router.url.includes('credit-proposal-status')) {
                    docLaData = [];
                  } else {
                    if (this.router.url.includes('cp-status-approval')) {
                      docLaData = [];
                    } else {
                      docLaData = res3.body;
                    }
                  }

                  this.typeData = [...res.body, ...res1.body, ...res2.body, ...docLaData];

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
                    } else if (this.typeData[i].id.includes('DOC_CP_COLL_OTHER')) {
                      this.typeData[i].collateralTypeId = 'OTHER';
                    } else if (this.typeData[i].id.includes('COR')) {
                      this.typeData[i].collateralTypeId = 'COR';
                    } else if (this.typeData[i].id.includes('IND')) {
                      this.typeData[i].collateralTypeId = 'IND';
                    }
                  }
                  const filterStatus: ICollateral[] = this.creditProposal.collaterals.filter(
                    data => data.statusId !== 'CANCEL' && data.statusId !== 'RELEASE' && data.statusId !== 'EXISTING'
                  );
                  const collateralData: IDocumentType[] = this.typeData.filter(obj1 =>
                    filterStatus.map(obj2 => obj2.collateralTypeId).includes(obj1.collateralTypeId)
                  );
                  const INDCORData: IDocumentType[] = this.typeData.filter(
                    obj =>
                      obj.customerType === this.creditProposal.customerType && obj.id !== 'DOC_IDD_BINDING' && obj.id !== 'DOC_CP_BINDING'
                  );
                  const PengikatKredit: IDocumentType[] = this.typeData.filter(
                    obj => obj.id === 'DOC_CP_BINDING' || obj.id === 'DOC_IDD_BINDING'
                  );
                  const PersetujuanKredit: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_AGGR');

                  const DocumentLainnya: IDocumentType[] = this.typeData.filter(
                    obj => obj.id === 'DOC_CP_OTHER' || obj.id === 'DOC_IDD_OTHER'
                  );
                  const DocumentLainnyaIdentitasDebiturPerorangan: IDocumentType[] = this.typeData.filter(
                    obj => obj.id === 'DOC_CP_OTHER_ID'
                  );

                  const docLa: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_LA_OPINION');

                  const takeOverData =
                    this.creditProposal.attributes['facilityTakeOver'].length > 0
                      ? this.typeData.filter(obj => obj.id === 'DOC_CP_COLL_TO')
                      : [];
                  const InvestorisData = Investoris ? this.typeData.filter(obj => obj.id.includes('COLL_STOCK')) : [];
                  const colllateralKapalData = colllateralKapal.length > 0 ? this.typeData.filter(obj => obj.id.includes('SHIP')) : [];
                  const jaminanFactoringData = jaminanFactoring ? this.typeData.filter(obj => obj.id.includes('COLL_EARC')) : [];
                  const nonKeuanganData = nonKeuangan.length > 0 ? this.typeData.filter(obj => obj.id.includes('PIUTG')) : [];
                  const result: IDocumentType[] = [
                    ...docLa,
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

  public handleAmpersandIcon(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace(/codeSpecialDan/g, '&');
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

    const dialogRef = this.dialog.open(DocumentChecklistDialogComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {
      // if (r !== 'save') {
      // }
    });
  }

  private getFiles(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const retrieveDataCpDuplicateIdd: Object = {
        key: `/cp/${id}/document/file-idd/`,
      };
      const dataCpOnly: Object = {
        key: `/cp/${id}/document/file-cp/`,
      };
      const retrieveIDDNotDuplicated: Object = {
        key: `/idd/${this.creditProposal.customerNumber}/document/`,
      };
      this.storageService.getObjects(this.bucket, retrieveDataCpDuplicateIdd).subscribe((res: any) => {
        if (res.body.length > 0) {
          for (let index = 0; index < res.body.length; index++) {
            this.file1 = [
              ...this.file1,
              {
                idFile: res.body[index].tags.id,
                url: res.body[index].url,
                name: res.body[index].key,
                remarks: res.body[index].tags.remarks,
                status: res.body[index].tags.status,
                dueDate: res.body[index].tags.dueDate,
                appealStatus: res.body[index].tags.appealStatus,
              },
            ];
          }

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
                  appealStatus: res1.body[index].tags.appealStatus,
                },
              ];
            }

            this.file = [...this.file1, ...this.file2];
            this.fileUrl = this.file;

            resolve();
          });
        } else {
          this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => {
            for (let index = 0; index < res1.body.length; index++) {
              this.file1 = [
                ...this.file1,
                {
                  idFile: res1.body[index].tags.id,
                  url: res1.body[index].url,
                  name: res1.body[index].key,
                  remarks: res1.body[index].tags.remarks,
                  status: res1.body[index].tags.status,
                  dueDate: res1.body[index].tags.dueDate,
                  appealStatus: res1.body[index].tags.appealStatus,
                },
              ];
            }

            this.storageService.getObjects(this.bucket, retrieveIDDNotDuplicated).subscribe((res2: any) => {
              for (let index = 0; index < res2.body.length; index++) {
                this.file2 = [
                  ...this.file2,
                  {
                    idFile: res2.body[index].tags.id,
                    url: res2.body[index].url,
                    name: res2.body[index].key,
                    remarks: res2.body[index].tags.remarks,
                    status: res2.body[index].tags.status,
                    dueDate: res2.body[index].tags.dueDate,
                    appealStatus: res2.body[index].tags.appealStatus,
                  },
                ];
              }
              this.file = [...this.file1, ...this.file2];
              this.fileUrl = this.file;

              resolve();
            });
          });
        }
      });
    });
  }
}
