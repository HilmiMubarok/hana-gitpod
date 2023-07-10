import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { CreditProposalOtherCovenantDialogComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditComponent } from './edit/credit-proposal-other-covenant-edit.component';
import { StorageService } from 'app/entities/storage/storage.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'jhi-other-deviation',
  templateUrl: './credit-proposal-other-deviation.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherDeviationComponent implements OnInit {
  public loading: boolean;
  public bucket: string;
  public file1 = [];
  public file2 = [];
  public file3 = [];
  public file = [];
  public fileUrl = [];
  public dataArray = [];

  public _creditProposalItem: ICreditProposal;
  public otherConvenantMinIO = [];
  public filterStatus: any[];
  public typeData = [];

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification'];

  constructor(public dialog: MatDialog, public storageService: StorageService, private documentTypeService: DocumentTypeService) {
    this.loading = false;
    this.filterStatus = [];
  }

  ngOnInit() {
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
    this.filterDeviation();
    this.getBucket().then(() => {
      this.getFiles(String(this.creditProposalItem.id));
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
                  description: res.body[index].tags.description,
                  parentDescription: res.body[index].tags.parentDescription,
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
                    description: res1.body[index].tags.description,
                    parentDescription: res1.body[index].tags.parentDescription,
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
                    description: res1.body[index].tags.description,
                    parentDescription: res1.body[index].tags.parentDescription,
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
                      description: res2.body[index].tags.description,
                      parentDescription: res2.body[index].tags.parentDescription,
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

  private groupByFolder(param: any[]): void {
    const sameIdObjects = [];
    const differentIdObjects = [];
    const idMap: any = {};

    param.forEach(obj => {
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
        this.filterStatus = [...this.filterStatus, this.otherConvenantMinIO[i]];
      }
    } else {
      for (let i = 0; i < this.otherConvenantMinIO.length; i++) {
        this.filterStatus = [...this.filterStatus, this.otherConvenantMinIO[i]];
      }
    }
  }

  // Add View Dialog
  public openDialog(element: IOtherCovenant = null): void {
    const predicate = { width: '60vw', data: { item: this.creditProposalItem } };
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
    const dialogRef = this.dialog.open(CreditProposalOtherCovenantDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposalItem.attributes['convenant']['otherCovenant'] = [
          ...this.creditProposalItem.attributes['convenant']['otherCovenant'],
          res,
        ];
      }
    });
  }

  public filterDeviation() {
    if (this.creditProposalItem.attributes['convenant']['otherCovenant'].length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['convenant']['otherCovenant'].length; i++) {
        if (this.creditProposalItem.attributes['convenant']['otherCovenant'][i].status !== 'Applied') {
          this.filterStatus = [...this.filterStatus, this.creditProposalItem.attributes['convenant']['otherCovenant'][i]];
        }
      }
    }
  }

  public folders = [];
  public dataFolder = [];

  // Edit
  public editDialog(element: IOtherCovenant = null): void {
    const predicate = { width: '45vw', data: {} };
    predicate.data['edit'] = true;
    if (element) {
      predicate.data['otherCovenant'] = element;
      predicate.data['edit'] = true;
    } else {
      predicate.data['otherCovenant'] = new OtherCovenant();
    }

    const dialogRef = this.dialog.open(CreditProposalOtherCovenantEditComponent, predicate);
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

  // DELETE
  public onDelete(element: ICreditProposal) {
    const dataGrid = this.creditProposalItem.attributes['convenant']['otherCovenant'].filter(({ id }) => id !== element.id);
    this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
    this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
  }
}
