import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { CreditProposalOtherCovenantDialogHistoryComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditHistoryComponent } from './edit/credit-proposal-other-covenant-edit.component';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';
import { StorageService } from 'app/entities/storage/storage.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'jhi-other-deviation-history',
  templateUrl: './credit-proposal-other-deviation.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherDeviationHistoryComponent implements OnInit {
  public loading: boolean;
  public otherConvenantMinIO = [];
  public _creditProposalItem: ICreditProposal;
  public file = [];
  public file1 = [];
  public file2 = [];
  public file3 = [];
  public bucket: string;

  public filterStatus: any[];

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  public parsedData: any;

  public historyData() {
    this.parsedData = parsePreviousAtrribute(this.creditProposalItem);
    if (this.isOnCompareData) {
      if (this.isCompareDar) {
        return this.creditProposalItem.attributes;
      } else {
        return this.parsedData.previousReturn;
      }
    } else {
      return this.parsedData.previousHistory;
    }
  }

  ngOnInit() {
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
    this.filterDeviation();
  }
  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification'];

  constructor(public dialog: MatDialog, public storageService: StorageService) {
    this.loading = false;
    this.filterStatus = [];
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
    const dialogRef = this.dialog.open(CreditProposalOtherCovenantDialogHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.historyData().convenant.otherCovenant = [...this.historyData().convenant.otherCovenant, res];
      }
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

        this.storageService.getObjects(this.bucket, dataIDDOnly).subscribe((res2: any) => {
          for (let index = 0; index < res2.body.length; index++) {
            if (res2.body[index].tags.status === 'Waived') {
              this.file3 = [
                ...this.file3,
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

          this.file = [...this.file2, this.file3];
          this.groupByFolder(this.file);
          resolve();
        });
      });
    });
  }

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

    const dialogRef = this.dialog.open(CreditProposalOtherCovenantEditHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      const othersCovenantIndex: number = lodash.findIndex(
        this.creditProposalItem.attributes['otherCovenant'],
        function (o: IOtherCovenant) {
          return o.id === res['convenant']['otherCovenant'].id;
        }
      );
      if (othersCovenantIndex > -1) {
        this.historyData().convenant.otherCovenant[othersCovenantIndex] = res['convenant']['otherCovenant'];
      } else {
        this.historyData().convenant.otherCovenant = [...this.historyData().convenant.otherCovenant, res['convenant']['otherCovenant']];
      }
    });
  }

  // DELETE
  public onDelete(element: ICreditProposal) {
    const dataGrid = this.historyData().convenant.otherCovenant.filter(({ id }) => id !== element.id);
    this.historyData().convenant.otherCovenant = dataGrid;
    this.historyData().convenant.otherCovenant = dataGrid;
  }

  public filterDeviation() {
    this.getFiles(String(this.creditProposalItem.id));
    if (this.historyData().convenant.otherCovenant.length !== 0) {
      for (let i = 0; i < this.historyData().convenant.otherCovenant.length; i++) {
        if (this.historyData().convenant.otherCovenant[i].status !== 'Applied') {
          this.filterStatus = [...this.filterStatus, this.historyData().convenant.otherCovenant[i]];
        }
      }
    }
  }
}
