import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICategoryList, IMainFacility } from 'app/entities/main-facility/main-facility.model';

@Component({
  selector: 'jhi-main-facility-info-child',
  templateUrl: './main-facility-info-child.component.html',
  styleUrls: ['./main-facility-info-child.style.css'],
})
export class MainFacilityInfoChildComponent implements OnChanges {
  @Input()
  get mainFacility() {
    return this._mainFacility;
  }

  set mainFacility(items: IMainFacility) {
    this._mainFacility = items;
  }

  private _mainFacility: IMainFacility;
  public dataSource: ICategoryList[];
  displayColumns = ['facilityCategory', 'mainPlafond', 'outstanding'];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainFacility']) {
      this.dataSource = this.mainFacility.categoryListDTO;
      console.log('ini data source ', this.dataSource);
    }
  }
}
