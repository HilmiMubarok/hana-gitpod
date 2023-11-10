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
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
    // this.isOtherDeviation && this.filterDeviation();
  }
  @Input() isViewMode: Boolean = false;
  // @Input() isOtherDeviation: Boolean = false;

  @Input() isOnCompareData: Boolean = false;

  @Input() isCompareDar: Boolean = false;

  @Input() isOnCreditAgreement: Boolean = false;
  @Input() creditAgreement: string;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification'];

  constructor(public dialog: MatDialog) {
    this.loading = false;
  }

  public historyData() {
    const { isOnCompareData, isCompareDar, isOnCreditAgreement, creditAgreement } = this;
    const { previousReturn, previousHistory, darRevHistory } = parsePreviousAtrribute(this.creditProposalItem);

    if (isOnCompareData) {
      if (isCompareDar) {
        return this.creditProposalItem.attributes;
      } else {
        return previousReturn;
      }
    } else {
      if (isOnCreditAgreement) {
        if (creditAgreement === 'FINAL CP') {
          return previousHistory;
        } else if (creditAgreement === 'PREVIOUS DAR') {
          return darRevHistory;
        } else if (creditAgreement === 'DAR REVISION') {
          return this.creditProposalItem.attributes;
        }
      }
      return previousHistory;
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
