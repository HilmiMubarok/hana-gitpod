import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ICategoryList, IMainFacility } from 'app/entities/main-facility/main-facility.model';

@Component({
  selector: 'jhi-loan-operation-main-facility-child',
  templateUrl: './loan-operation-main-facility-child.component.html',
  styleUrls: ['../../../credit-proposal/loan-facility/main-facility/main-facility-child.component.scss'],
})
export class LoanOperationMainFacilityChildComponent implements OnChanges {
  public dataSource: ICategoryList[];
  public displayColumns = ['facilityCategory', 'mainPlafond', 'outstanding', 'changes', 'totalPlafond'];

  private _mainData: IMainFacility;

  @Input()
  get mainData() {
    return this._mainData;
  }

  set mainData(items: IMainFacility) {
    this._mainData = items;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainData']) {
      this.dataSource = this.mainData.categoryListDTO;
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
