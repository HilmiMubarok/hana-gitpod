import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IMainFacility } from 'app/entities/main-facility/main-facility.model';
import { MainFacilityDialogDarComponent } from './main-facility-dialog-dar.component';
import moment from 'moment';

@Component({
  selector: 'jhi-main-facility-dar',
  templateUrl: './main-facility-dar.component.html',
  styleUrls: ['./main-facility-dar.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainFacilityDarComponent implements OnInit, OnChanges {
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
    const dialogRef = this.dialog.open(MainFacilityDialogDarComponent, {
      width: '80vw',
      data: {
        mainData: params,
        item: this.creditProposal,
      },
    });
    dialogRef.afterClosed().subscribe((data: IMainFacility) => {
      if (data.newMaturityDate) {
        data.newMaturityDate = this.setDate(data.newMaturityDate);
      }
      if (data.startPeriodDate) {
        data.startPeriodDate = this.setDate(data.startPeriodDate);
      }
    });
  }
  private setDate(data: any) {
    const staticDate = moment(new Date(data)).format().substring(0, 19) + 'Z';
    return staticDate;
  }
}
