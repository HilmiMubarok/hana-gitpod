import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CompareDataService } from '../../services/compare-data.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from 'app/entities/credit-proposal/convenant/other-covenant/other-convenant.model';
import { CompareDataCovenantOtherDialogComponent } from './dialog/compare-data-covenant-other-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'app/entities/storage/storage.service';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'jhi-compare-data-covenant-other',
  templateUrl: './compare-data-covenant-other.component.html',
  styleUrls: ['../../../credit-proposal/convenant/other-covenant/other-covenant.css'],
})
export class CompareDataCovenantOtherComponent implements OnDestroy, OnChanges, OnInit {
  public creditProposal: ICreditProposal;
  public cpDynamicAttributeData: any;
  public otherCovenantData: any;
  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification', 'action'];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public bucket: string;
  public typeData: any[] = [];
  public otherConvenantMinIO: any[] = [];
  public filterStatus: any[];
  public file: any[] = [];
  public file1: any[] = [];
  public file2: any[] = [];

  @Input() dataFrom: string;
  @Input() isDeviation: Boolean = false;

  constructor(
    private compareDataService: CompareDataService,
    private dialog: MatDialog,
    private storageService: StorageService,
    public documentTypeService: DocumentTypeService,
    public partyCifService: PartyCifService
  ) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.destroy$)).subscribe((creditProposal: ICreditProposal) => {
      this.creditProposal = creditProposal;
    });
  }

  ngOnInit(): void {
    this._getHistoryAttributes();

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
                  } else if (this.typeData[i].id.includes('DOC_CP_OTHER') || this.typeData[i].id.includes('DOC_IDD_OTHER')) {
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
                const INDCORData: IDocumentType[] = this.typeData.filter(obj => obj.customerType === this.creditProposal.customerType);
                const PersetujuanKredit: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_AGGR');
                const PengikatKredit: IDocumentType[] = this.typeData.filter(
                  obj => obj.id === 'DOC_CP_BINDING' || obj.id === 'DOC_IDD_BINDING'
                );
                const DocumentJaminanLainnya: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_COLL_OTHER');
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
                  ...DocumentJaminanLainnya,
                  ...DocumentLainnyaIdentitasDebiturPerorangan,
                  ...takeOverData,
                  ...InvestorisData,
                  ...colllateralKapalData,
                  ...jaminanFactoringData,
                  ...nonKeuanganData,
                ];

                for (let i = 0; i < result.length; i++) {
                  this.documentTypeService.documentTypeList(result[i].id).subscribe((re: any) => {
                    let level = re.body;

                    const mergeArray: ILevel[] = level.map(item1 => {
                      const file = this.file.find(item2 => item2.idFile === item1.id);
                      return { ...item1, ...file };
                    });

                    const personalCorporate = mergeArray.filter(obj => obj.customerType === this.creditProposal.customerType);
                    const nullData = mergeArray.filter(obj => obj.customerType === 'ALL');

                    level = [...personalCorporate, ...nullData];

                    this.groupByFolder(level);
                  });
                }
              });
            });
          });
        });
      });
    });
  }

  public folders = [];
  public dataFolder = [];
  private groupByFolder(param: any[]): void {
    const waived = param.filter((data: any) => data.status === 'Waived');
    const sameIdObjects = [];
    const differentIdObjects = [];
    const idMap: any = {};

    waived.forEach(obj => {
      if (idMap[obj.idFile]) {
        idMap[obj.idFile].count++;
      } else {
        idMap[obj.idFile] = {
          categoryId: '',
          covenant: obj.description,
          categoryName: obj.parentDescription,
          status: obj.status,
          justification: '',

          otherCovenant: {
            covenant: '',
            deviation: '',
            justification: '',
            status: '',
          },
          sub_category: '',
          deviation: '',
          id: uuidv4(),
        };
      }
    });

    for (const key in idMap) {
      if (idMap[key].count !== undefined) {
        sameIdObjects.push(idMap[key]);
      } else if (idMap[key].count === undefined) {
        differentIdObjects.push(idMap[key]);
      }
    }
    this.otherConvenantMinIO = [...sameIdObjects, ...differentIdObjects];

    for (let i = 0; i < this.otherConvenantMinIO.length; i++) {
      if (this.otherConvenantMinIO[i].categoryName !== undefined && this.otherConvenantMinIO[i].categoryName !== null) {
        this.otherCovenantData = [...this.otherCovenantData, this.otherConvenantMinIO[i]];
      }
    }
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
            if (res.body[index].tags.status === 'Waived') {
              this.file1 = [
                ...this.file1,
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
          }

          this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => {
            for (let index = 0; index < res1.body.length; index++) {
              if (res1.body[index].tags.status === 'Waived') {
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
            }

            this.file = [...this.file1, ...this.file2];
            if (this.file.length > 0) {
              this.groupByFolder(this.file);
            }

            resolve();
          });
        } else {
          this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => {
            for (let index = 0; index < res1.body.length; index++) {
              if (res1.body[index].tags.status === 'Waived') {
                this.file1 = [
                  ...this.file1,
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
            }

            this.storageService.getObjects(this.bucket, retrieveIDDNotDuplicated).subscribe((res2: any) => {
              for (let index = 0; index < res2.body.length; index++) {
                if (res2.body[index].tags.status === 'Waived') {
                  this.file2 = [
                    ...this.file2,
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
              }
              this.file = [...this.file1, ...this.file2];

              if (this.file.length > 0) {
                this.groupByFolder(this.file);
              }
              resolve();
            });
          });
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataFrom && changes.dataFrom.currentValue) {
      this.dataFrom = changes.dataFrom.currentValue;
    }
    if (changes.isDeviation && changes.isDeviation.currentValue) {
      this.isDeviation = changes.isDeviation.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private _getHistoryAttributes(): void {
    if (this.dataFrom === 'previousHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousHistory;
    } else if (this.dataFrom === 'previousReturn') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.previousReturn;
    } else if (this.dataFrom === 'darRevHistory') {
      this.cpDynamicAttributeData = this.creditProposal.attributes.darRevHistory;
    } else if (this.dataFrom === 'previousDar') {
      this.compareDataService.creditProposalPreviousDar.pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.cpDynamicAttributeData = data.attributes;
      });
    } else {
      this.cpDynamicAttributeData = this.creditProposal.attributes;
    }

    this.otherCovenantData = this.isDeviation
      ? this.cpDynamicAttributeData.convenant.otherCovenant.filter((item: IOtherCovenant) => item.status !== 'Applied')
      : this.cpDynamicAttributeData.convenant.otherCovenant;
  }

  public openDialog(element: IOtherCovenant = null): void {
    const predicate = { width: '80vw', data: { item: element }, panelClass: 'custom-dialog-container' };
    const dialogRef = this.dialog.open(CompareDataCovenantOtherDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {});
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }
}
