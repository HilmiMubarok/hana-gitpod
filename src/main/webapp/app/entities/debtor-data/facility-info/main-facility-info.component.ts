import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'jhi-main-facility-info',
  styleUrls: ['./main-facility-info.style.css'],
  templateUrl: './main-facility-info.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainFacilityInfoComponent {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['no', 'appraisalNo', 'currency', 'mainPlafond', 'maturityDate', 'availableLimit'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null;

  public id: any;

  public expanData(element: PeriodicElement) {
    console.log(element);
    this.id = element.position;
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
