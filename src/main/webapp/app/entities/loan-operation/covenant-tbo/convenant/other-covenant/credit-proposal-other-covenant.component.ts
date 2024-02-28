import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../../../credit-proposal/credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { OtherCovenantLoanDialogComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditTempComponent } from './edit/credit-proposal-other-covenant-edit.component';
import { StorageService } from 'app/entities/storage/storage.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { v4 as uuidv4 } from 'uuid';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { Router } from '@angular/router';
@Component({
  selector: 'jhi-other-covenant-loan',
  templateUrl: './credit-proposal-other-covenant.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class OtherCovenantLoanComponent implements OnInit {
  public loading: boolean;
  public otherDeviation: any;
  public _creditProposalItem: ICreditProposal;
  public file = [];
  public file1 = [];
  public file2 = [];
  public file3 = [];
  public bucket: string;
  public otherConvenantMinIO = [];
  public filterStatus: any[];
  public typeData = [];

  @Input() isViewMode: Boolean = false;

  @Input() isOtherDeviation: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification', 'action'];

  constructor(
    public dialog: MatDialog,
    public storageService: StorageService,
    private partyCifService: PartyCifService,
    private documentTypeService: DocumentTypeService,
    private router: Router
  ) {
    this.loading = false;
    this.filterStatus = [];
  }

  isOnPK = (() => {
    if (['review-pk', 'finalize-pk'].includes(this.router.url.split('/')[1])) {
      return true;
    } else {
      return false;
    }
  })();

  isOnDarRevision = (() => {
    if (['dar-revision', 'dar-revision-checker'].includes(this.router.url.split('/')[1])) {
      return true;
    } else {
      return false;
    }
  })();

  data;

  ngOnInit() {
    if (
      this.creditProposalItem.attributes['darRevHistory'] &&
      this.creditProposalItem.statusId !== 'PK_DAR_REVISION' &&
      this.creditProposalItem.statusId !== 'PK_DAR_REVISION_CHECKER'
    ) {
      const parsed = parsePreviousAtrribute(this.creditProposalItem);
      this.data = parsed['darRevHistory'].convenant.otherCovenant;
    } else {
      this.data = this.creditProposalItem.attributes['convenant'].otherCovenant;
    }
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;

    if (this.isOtherDeviation) {
      if (!this.isOnPK) {
        this.displayColumns.pop();
      }
    }

    this.isOtherDeviation && this.filterDeviation();

    this.partyCifService.findCollateral(this.creditProposalItem.cif.customerId, 'R201').subscribe((find: any) => {
      const Investoris = find.body;
      const colllateralKapal = this.creditProposalItem.collaterals.filter(
        (data: any) =>
          data.attributes.collateralCode === 'AN0206' &&
          data.statusId !== 'CANCEL' &&
          data.statusId !== 'RELEASE' &&
          data.statusId !== 'EXISTING'
      );
      const nonKeuangan = this.creditProposalItem.collaterals.filter(
        (data: any) =>
          data.attributes.collateralCode === 'AN0299' &&
          data.statusId !== 'CANCEL' &&
          data.statusId !== 'RELEASE' &&
          data.statusId !== 'EXISTING'
      );
      const eArcLoanForegn = [];
      const eArcLoan = [];
      for (let i = 0; i < this.creditProposalItem.products.length; i++) {
        if (this.creditProposalItem.products[i].productName === 'Working Capital - eARC Loan(Foreign)') {
          eArcLoanForegn.push(this.creditProposalItem.products[i]);
        }

        if (this.creditProposalItem.products[i].productName === 'Working Capital - eARC Loan') {
          eArcLoan.push(this.creditProposalItem.products[i]);
        }
      }
      const jaminanFactoring = eArcLoanForegn.length > 0 || eArcLoan.length > 0 ? true : false;

      if (this.creditProposalItem.attributes['collateralAfterData']) {
        while (typeof this.creditProposalItem.attributes['collateralAfterData'] === 'string') {
          this.creditProposalItem.attributes['collateralAfterData'] = JSON.parse(this.creditProposalItem.attributes['collateralAfterData']);
        }
      } else {
        this.creditProposalItem.attributes['collateralAfterData'] = [];
      }

      this.getBucket().then(() => {
        this.getFiles(String(this.creditProposalItem.id)).then(() => {
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
                const filterStatus: ICollateral[] = this.creditProposalItem.collaterals.filter(
                  data => data.statusId !== 'CANCEL' && data.statusId !== 'RELEASE' && data.statusId !== 'EXISTING'
                );
                const collateralData: IDocumentType[] = this.typeData.filter(obj1 =>
                  filterStatus.map(obj2 => obj2.collateralTypeId).includes(obj1.collateralTypeId)
                );
                const INDCORData: IDocumentType[] = this.typeData.filter(obj => obj.customerType === this.creditProposalItem.customerType);
                const PersetujuanKredit: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_AGGR');
                const PengikatKredit: IDocumentType[] = this.typeData.filter(
                  obj => obj.id === 'DOC_CP_BINDING' || obj.id === 'DOC_IDD_BINDING'
                );
                const DocumentJaminanLainnya: IDocumentType[] = this.typeData.filter(obj => obj.id === 'DOC_CP_COLL_OTHER');
                const DocumentLainnyaIdentitasDebiturPerorangan: IDocumentType[] = this.typeData.filter(
                  obj => obj.id === 'DOC_CP_OTHER_ID'
                );

                const takeOverData =
                  this.creditProposalItem.attributes['facilityTakeOver'].length > 0
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

                    const personalCorporate = mergeArray.filter(obj => obj.customerType === this.creditProposalItem.customerType);
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

  // Add View Dialog
  public openDialog(element: IOtherCovenant = null): void {
    const predicate = { width: '80vw', data: { item: this.creditProposalItem }, panelClass: 'custom-dialog-container' };
    predicate.data['view'] = false;
    if (element) {
      predicate.data['otherCovenant'] = element;
      predicate.data['view'] = true;
    } else {
      const otherCovenant: IOtherCovenant = new OtherCovenant();
      otherCovenant.otherCovenant = {};
      otherCovenant.otherCovenant['covenant'] = '';
      otherCovenant.otherCovenant['status'] = '';
      otherCovenant.otherCovenant['deviation'] = '';
      otherCovenant.otherCovenant['justification'] = '';

      predicate.data['otherCovenant'] = otherCovenant;
      predicate.data['view'] = false;
    }
    const dialogRef = this.dialog.open(OtherCovenantLoanDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposalItem.attributes['convenant']['otherCovenant'] = [
          ...this.creditProposalItem.attributes['convenant']['otherCovenant'],
          res,
        ];
        this.data = this.creditProposalItem.attributes['convenant']['otherCovenant'];
      }
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

  public filterDeviation() {
    const otherCovenant = this.creditProposalItem.attributes['darRevHistory']
      ? parsePreviousAtrribute(this.creditProposalItem)['darRevHistory'].convenant.otherCovenant
      : this.creditProposalItem.attributes['convenant']['otherCovenant'];

    const data = (() => {
      if (this.isOnDarRevision) {
        return this.creditProposalItem.attributes['convenant']['otherCovenant'];
      } else {
        return otherCovenant;
      }
    })();

    this.filterStatus = data.filter(item => item.status !== 'Applied');
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
    if (this.filterStatus.length > 0) {
      for (let i = 0; i < this.otherConvenantMinIO.length; i++) {
        if (this.otherConvenantMinIO[i].categoryName !== undefined && this.otherConvenantMinIO[i].categoryName !== null) {
          this.filterStatus = [...this.filterStatus, this.otherConvenantMinIO[i]];
        }
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
        key: `/idd/${this.creditProposalItem.customerNumber}/document/`,
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
  // Edit
  public editDialog(element: IOtherCovenant = null): void {
    const predicate = { width: '80vw', data: {}, panelClass: 'custom-dialog-container' };
    predicate.data['edit'] = true;
    if (element) {
      predicate.data['otherCovenant'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['otherCovenant'] = new OtherCovenant();
    }

    const dialogRef = this.dialog.open(CreditProposalOtherCovenantEditTempComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const othersCovenantIndex: number = lodash.findIndex(
        this.creditProposalItem.attributes['otherCovenant'],
        function (o: IOtherCovenant) {
          return o.id === res['convenant']['otherCovenant'].id;
        }
      );
      if (othersCovenantIndex > -1) {
        this.creditProposalItem.attributes['convenant']['otherCovenant'][othersCovenantIndex] = res['convenant']['otherCovenant'];
      } else {
        this.creditProposalItem.attributes['convenant']['otherCovenant'] = [
          ...this.creditProposalItem.attributes['convenant']['otherCovenant'],
          res['convenant']['otherCovenant'],
        ];
      }
    });
  }
  // Delete Confirmation
  public onDelete(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Covenant',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const dataGrid = this.creditProposalItem.attributes['convenant']['otherCovenant'].filter(({ id }) => id !== element.id);
        this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
        this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
        this.data = this.creditProposalItem.attributes['convenant']['otherCovenant'];
      }
    });
  }

  // // DELETE
  // public onDelete(element: ICreditProposal) {
  //   const dataGrid = this.creditProposalItem.attributes['convenant']['otherCovenant'].filter(({ id }) => id !== element.id);
  //   this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
  //   this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
  // }
}
