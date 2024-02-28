import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IMainFacility } from 'app/entities/main-facility/main-facility.model';
import moment from 'moment';
import { LoanOperationMainFacilityDialogComponent } from './loan-operation-main-facility-dialog.component';

@Component({
  selector: 'jhi-loan-operation-main-facility',
  templateUrl: './loan-operation-main-facility.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/main-facility/main-facility.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LoanOperationMainFacilityComponent implements OnChanges {
  constructor(public dialog: MatDialog) {}

  public dataSource: MatTableDataSource<IMainFacility>;
  public dataMain: IMainFacility;
  public columnsToDisplay = [
    'no',
    'appraisalNo',
    'ccy',
    'mainPlafond',
    'changes',
    'totalPlafond',
    'currentMaturityDate',
    'newMaturityDate',
    'lastAgrmeentDate',
    'action',
  ];
  public columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  public expandedElement: IMainFacility | null;
  public id: any;

  private _creditProposal: ICreditProposal;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() isElement: boolean;
  @Input() isLabel: boolean;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['creditProposal']) {
      this.dataSource = new MatTableDataSource<IMainFacility>(this._creditProposal.mainProducts);
      this.dataSource.paginator = this.paginator;
    }
  }

  public expanData(element: IMainFacility) {
    this.dataMain = element;
  }

  public openDialog(params: IMainFacility) {
    const dialogRef = this.dialog.open(LoanOperationMainFacilityDialogComponent, {
      width: '80vw',
      data: {
        mainData: params,
        creditProposal: this.creditProposal,
        isLabel: this.isLabel,
        isElement: this.isElement,
      },
    });
    dialogRef.afterClosed().subscribe((data: IMainFacility) => {
      if (data.newMaturityDate) {
        data.newMaturityDate = this.setDate(data.newMaturityDate);
      }
    });
  }

  public printElements(element) {
    if (element === null || element === 'null') {
      return 0;
    }
    return element;
  }

  public getCurrencyType(element) {
    if (element !== null) {
      return element;
    }
    return '';
  }

  private setDate(data: any) {
    const staticDate = moment(new Date(data)).format().substring(0, 19) + 'Z';
    return staticDate;
  }
}
