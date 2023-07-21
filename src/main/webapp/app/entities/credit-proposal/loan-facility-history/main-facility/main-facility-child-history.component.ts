import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ICategoryList, IMainFacility } from 'app/entities/main-facility/main-facility.model';

@Component({
  selector: 'jhi-main-facility-child-history',
  templateUrl: './main-facility-child-history.component.html',
  styleUrls: ['./main-facility-child-history.component.scss'],
})
export class MainFacilityChildHistoryComponent implements OnChanges {
  @Input()
  get mainData() {
    return this._mainData;
  }

  set mainData(items: IMainFacility) {
    this._mainData = items;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public dataSource: MatTableDataSource<ICategoryList>;
  private _mainData: IMainFacility;
  displayColumns = ['facilityCategory', 'mainPlafond', 'outstanding', 'changes', 'totalPlafond'];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainData']) {
      this.dataSource = new MatTableDataSource<ICategoryList>(this.mainData.categoryListDTO);
      this.dataSource.paginator = this.paginator;
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
