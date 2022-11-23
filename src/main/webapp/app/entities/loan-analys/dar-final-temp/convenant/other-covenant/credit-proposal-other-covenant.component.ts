import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../../../credit-proposal/credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { OtherCovenantTempDialogComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditTempComponent } from './edit/credit-proposal-other-covenant-edit.component';

@Component({
  selector: 'jhi-other-covenant-temp',
  templateUrl: './credit-proposal-other-covenant.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class OtherCovenantTempComponent implements OnInit {
  public loading: boolean;

  public _creditProposalItem: ICreditProposal;

  ngOnInit() {
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
  }
  @Input() isViewMode: Boolean = false;

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
    const dialogRef = this.dialog.open(OtherCovenantTempDialogComponent, predicate);
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
    const predicate = { width: '45vw', data: {} };
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

  // DELETE
  public onDelete(element: ICreditProposal) {
    const dataGrid = this.creditProposalItem.attributes['convenant']['otherCovenant'].filter(({ id }) => id !== element.id);
    this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
    this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
  }
}
