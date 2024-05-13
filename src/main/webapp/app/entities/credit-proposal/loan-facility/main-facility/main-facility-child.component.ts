import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICategoryList, IMainFacility } from 'app/entities/main-facility/main-facility.model';

@Component({
  selector: 'jhi-main-facility-child',
  templateUrl: './main-facility-child.component.html',
  styleUrls: ['./main-facility-child.component.scss'],
})
export class MainFacilityChildComponent implements OnChanges {
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
      this.dataSource = this.mainData ? this.mainData.categoryListDTO : [];
    }
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
