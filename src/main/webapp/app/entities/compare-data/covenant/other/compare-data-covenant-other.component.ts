import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CompareDataService } from '../../services/compare-data.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IOtherCovenant } from 'app/entities/credit-proposal/convenant/other-covenant/other-convenant.model';
import { CompareDataCovenantOtherDialogComponent } from './dialog/compare-data-covenant-other-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StorageService } from 'app/entities/storage/storage.service';

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

  @Input() dataFrom: string;
  @Input() isDeviation: Boolean = false;

  constructor(private compareDataService: CompareDataService, private dialog: MatDialog) {
    this.compareDataService.creditProposal.pipe(takeUntil(this.destroy$)).subscribe((creditProposal: ICreditProposal) => {
      this.creditProposal = creditProposal;
    });
  }

  ngOnInit(): void {
    this._getHistoryAttributes();
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
}
