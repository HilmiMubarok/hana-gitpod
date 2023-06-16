import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICategoryList, IMainFacility } from 'app/entities/main-facility/main-facility.model';

@Component({
  selector: 'jhi-main-facility-child-dar',
  templateUrl: './main-facility-child-dar.component.html',
  styleUrls: ['./main-facility-child-dar.component.scss'],
})
export class MainFacilityChildDarComponent implements OnChanges {
  @Input()
  get mainData() {
    return this._mainData;
  }

  set mainData(items: IMainFacility) {
    this._mainData = items;
  }

  public dataSource: ICategoryList[];
  private _mainData: IMainFacility;
  displayColumns = ['facilityCategory', 'mainPlafond', 'outstanding', 'changes', 'totalPlafond'];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainData']) {
      this.dataSource = this.mainData.categoryListDTO;
    }
  }

  public getValue(element) {
    if (element === null) {
      return 0;
    }
    return element;
  }
}
