import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { CreditProposalOtherCovenantDialogHistoryComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditHistoryComponent } from './edit/credit-proposal-other-covenant-edit.component';
import { parsePreviousAtrribute } from 'app/shared/helper/utils';

@Component({
  selector: 'jhi-other-covenant-history',
  templateUrl: './credit-proposal-other-covenant.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherCovenantHistoryComponent implements OnInit {
  public loading: boolean;

  public _creditProposalItem: ICreditProposal;

  public parsedData: any;

  public dataSource;

  ngOnInit() {
    this.parsedData = this.historyData();
    // this.dataSource =
    //   typeof this.parsedData.convenant === 'string' ||
    //   (typeof this.parsedData.convenant === 'undefined' && JSON.parse(this.parsedData.convenant));
    console.log('padsdfs', {
      parsed: this.parsedData,
      parsedType: typeof this.parsedData.convenant,
      // dataSource: this.dataSource,
      // dataSourceType: typeof this.dataSource,
    });
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
    // this.isOtherDeviation && this.filterDeviation();
  }
  @Input() isViewMode: Boolean = false;
  // @Input() isOtherDeviation: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'covenant', 'status', 'deviation', 'justification', 'action'];

  constructor(public dialog: MatDialog) {
    this.loading = false;
  }

  public historyData() {
    this.parsedData = parsePreviousAtrribute(this.creditProposalItem);
    if (this.isOnCompareData) {
      if (this.isCompareDar) {
        return this.creditProposalItem.attributes;
      } else {
        if (this.parsedData.previousReturn) {
          return this.parsedData.previousReturn;
        } else {
          return this.parsedData.previousHistory;
        }
      }
    } else {
      if (this.parsedData.previousReturn) {
        return this.parsedData.previousReturn;
      } else {
        return this.parsedData.previousHistory;
      }
    }
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
    const dialogRef = this.dialog.open(CreditProposalOtherCovenantDialogHistoryComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.creditProposalItem.attributes['convenant']['otherCovenant'] = [
          ...this.creditProposalItem.attributes['convenant']['otherCovenant'],
          res,
        ];
      }
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

    const dialogRef = this.dialog.open(CreditProposalOtherCovenantEditHistoryComponent, predicate);
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
