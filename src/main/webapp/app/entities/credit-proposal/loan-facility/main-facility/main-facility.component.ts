import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MainFacilityDialogComponent } from './main-facility-dialog.component';

@Component({
  selector: 'jhi-main-facility',
  templateUrl: './main-facility.component.html',
  styleUrls: ['./main-facility.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainFacilityComponent {
  constructor(public dialog: MatDialog) {}

  dataSource = ELEMENT_DATA;
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
  expandedElement: PeriodicElement | null;

  public id: any;

  public expanData(element: PeriodicElement) {
    console.log(element);
    this.id = element.position;
  }

  public openDialog(element): void {
    const predicate: object = {
      width: '80vw',
      data: {
        elemen: element,
      },
    };
    const dialogRef = this.dialog.open(MainFacilityDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen`,
  },
  {
    position: 2,
    name: 'Oxigen',
    weight: 2000,
    symbol: 'H2O',
    description: `Oxygen`,
  },
  {
    position: 3,
    name: 'Pattogen',
    weight: 2000,
    symbol: 'P2C',
    description: `Golem`,
  },
];
