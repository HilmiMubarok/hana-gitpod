import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { CreditProposalOtherCovenantDialogComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditComponent } from './edit/credit-proposal-other-covenant-edit.component';
import { StorageService } from 'app/entities/storage/storage.service';
@Component({
  selector: 'jhi-other-deviation',
  templateUrl: './credit-proposal-other-deviation.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherDeviationComponent implements OnInit {
  public loading: boolean;

  public _creditProposalItem: ICreditProposal;

  public filterStatus: any[];

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  ngOnInit() {
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
    this.filterDeviation();
  }

  public displayColumns: string[] = ['no', 'covenant', 'status', 'deviation', 'justification'];

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
    this.getFiles(this.creditProposalItem.id);
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
  private groupByFolder(param: any[]): void {
    this.folders = [];

    if (param.length > 0) {
      this.folders = lodash
        .chain(param)
        .groupBy('tags.document')
        .map((val, key) => ({
          folder: key,
          key: val[0].key,
          data: val,
          documentType: val[0]['tags']['documentType'],
          document: val[0]['tags']['document'],
          category: val[0]['tags']['category'],
          dueDate: val[0]['tags']['dueDate'],
          status: val[0]['tags']['status'],
          remarks: val[0]['tags']['remarks'],

          files: val,
        }))
        .value();
      const dataset = [];
      for (let i = 0; i < this.folders.length; i++) {
        const setdata = {
          no: this.folders.length + 1,
          covenant: this.folders[i].document,
          status: this.folders[i].status,
          deviation: this.folders[i].remarks,
          formGroub: true,
          justification: '',
        };
        dataset.push(setdata);
      }

      for (let i = 0; i < dataset.length; i++) {
        if (dataset[i].status === 'Waived') {
          this.filterStatus = [...this.filterStatus, dataset[i]];
        }
      }
    } else {
      this.folders = [];
    }
  }

  private getFiles(id: any): void {
    const predicate: Object = {
      key: `/credit_proposal/${id}/document`,
    };
    this.storageService.getBucketName().subscribe((res: any) => {
      this.storageService.getObjects(res.body.bucket, predicate).subscribe(a => {
        this.groupByFolder(a.body);
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
