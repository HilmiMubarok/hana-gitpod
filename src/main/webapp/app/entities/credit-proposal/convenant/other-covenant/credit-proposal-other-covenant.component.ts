import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import lodash from 'lodash';
import { ICreditProposal } from '../../credit-proposal.model';
import { IOtherCovenant, OtherCovenant } from './other-convenant.model';
import { CreditProposalOtherCovenantDialogComponent } from './add/credit-proposal-other-covenant-dialog.component';
import { CreditProposalOtherCovenantEditComponent } from './edit/credit-proposal-other-covenant-edit.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-other-covenant',
  templateUrl: './credit-proposal-other-covenant.component.html',
  styleUrls: ['./other-covenant.css'],
})
export class CreditProposalOtherCovenantComponent implements OnInit {
  public loading: boolean;

  public _creditProposalItem: ICreditProposal;
  data: any;

  ngOnInit() {
    this.isViewMode ? this.displayColumns.splice(this.displayColumns.length - 1, 1) : null;
    // this.isOtherDeviation && this.filterDeviation();
    this.data = this.creditProposalItem.attributes['convenant']['otherCovenant'];
  }
  @Input() isViewMode: Boolean = false;
  // @Input() isOtherDeviation: Boolean = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(item: ICreditProposal) {
    this._creditProposalItem = item;
  }

  public displayColumns: string[] = ['no', 'category', 'sub_category', 'covenant', 'status', 'deviation', 'justification', 'action'];

  constructor(public dialog: MatDialog) {
    this.loading = false;
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

    const dialogRef = this.dialog.open(CreditProposalOtherCovenantEditComponent, predicate);

    dialogRef.afterClosed().subscribe(res => {
      if (res.caption !== 'cancel') {
        const othersCovenantIndex: number = lodash.findIndex(
          this.creditProposalItem.attributes['convenant']['otherCovenant'],
          function (o: IOtherCovenant) {
            return o.id === res['otherCovenant'].id;
          }
        );
        if (othersCovenantIndex > -1) {
          this.creditProposalItem.attributes['convenant']['otherCovenant'][othersCovenantIndex] = res['otherCovenant'];
        } else {
          this.creditProposalItem.attributes['convenant']['otherCovenant'] = [
            ...this.creditProposalItem.attributes['convenant']['otherCovenant'],
            res['otherCovenant'],
          ];
        }
        this.data = this.creditProposalItem.attributes['convenant']['otherCovenant'];
      } else {
        const convenantTemp = lodash.cloneDeep(res['otherCovenant']);
        const othersCovenantIndex: number = lodash.findIndex(
          this.creditProposalItem.attributes['convenant']['otherCovenant'],
          function (o: IOtherCovenant) {
            return o.id === convenantTemp.id;
          }
        );
        if (othersCovenantIndex > -1) {
          this.creditProposalItem.attributes['convenant']['otherCovenant'][othersCovenantIndex] = convenantTemp;
        } else {
          this.creditProposalItem.attributes['convenant']['otherCovenant'] = [
            ...this.creditProposalItem.attributes['convenant']['otherCovenant'],
            convenantTemp,
          ];
        }
        this.data = this.creditProposalItem.attributes['convenant']['otherCovenant'];
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
      }
    });
  }

  // DELETE
  // public onDelete(element: ICreditProposal) {
  //   const dataGrid = this.creditProposalItem.attributes['convenant']['otherCovenant'].filter(({ id }) => id !== element.id);
  //   this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
  //   this.creditProposalItem.attributes['convenant']['otherCovenant'] = dataGrid;
  // }
}
