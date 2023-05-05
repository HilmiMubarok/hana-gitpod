import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'jhi-main-facility-child',
  templateUrl: './main-facility-child.component.html',
  styleUrls: ['./main-facility-child.component.scss'],
})
export class MainFacilityChildComponent implements OnInit, OnChanges {
  @Input()
  get id() {
    return this._id;
  }

  set id(items: any) {
    this._id = items;
  }

  private _id: any;

  dataSource: PeriodicElement[];
  dataSource2: PeriodicElement[];
  displayColumns = ['facilityCategory', 'mainPlafond', 'outstanding', 'changes', 'totalPlafond'];

  constructor() {}

  ngOnInit() {
    console.log('child ', this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id']) {
      console.log('changes ', this.id);
      const data: PeriodicElement[] = ELEMENT_DATA.filter(obj => obj.position === this.id);
      console.log('data element find ', data);
      this.dataSource = data;
    }
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
    name: 'anjar',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen`,
  },
  {
    position: 2,
    name: 'rendy',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen`,
  },
  {
    position: 3,
    name: 'obet',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen`,
  },
];
