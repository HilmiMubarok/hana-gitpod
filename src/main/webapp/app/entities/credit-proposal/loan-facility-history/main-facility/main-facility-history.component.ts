import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { IMainFacility } from 'app/entities/main-facility/main-facility.model';
import { MatDialog } from '@angular/material/dialog';
import { MainFacilityDialogHistoryComponent } from './main-facility-dialog-history.component';

@Component({
  selector: 'jhi-main-facility-history',
  templateUrl: './main-facility-history.component.html',
  styleUrls: ['./main-facility-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainFacilityHistoryComponent implements OnInit, OnChanges {
  private _creditProposal: ICreditProposal;
  public dataSource: IMainFacility[];
  public dataMain: IMainFacility;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  constructor(public dialog: MatDialog) {}

  columnsToDisplay = [
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
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IMainFacility | null;

  public id: any;

  ngOnInit() {
    console.log('ini cp main products', this.creditProposal.mainProducts);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['creditProposal']) {
      this.dataSource = this.creditProposal.mainProducts;
    }
  }

  public expanData(element: IMainFacility) {
    this.dataMain = element;
    console.log(element);
  }

  public openDialog(params: IMainFacility) {
    const dialogRef = this.dialog.open(MainFacilityDialogHistoryComponent, {
      width: '80vw',
      data: {
        mainData: params,
        creditProposal: this.creditProposal,
      },
    });
    dialogRef.afterClosed().subscribe((data: IMainFacility) => {
      console.log(data);
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
}
