import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ICollateralProperty } from '../collateral-property.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CollateralPropertyBuildingFloorDialogComponent } from '../dialogs/collateral-property-building-floor-dialog.component';
import { CollateralPropertyService } from '../collateral-property.service';

@Component({
  selector: 'jhi-collateral-property-list-personal-property-template',
  templateUrl: './collateral-property-list-personal-property-template.component.html',
})
export class CollateralPropertyListPersonalPropertyTemplateComponent implements OnChanges {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  @Input()
  public landType: 'LAND' | 'BUILDING' = 'LAND';

  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  public displayedColumnBuilding: string[] = [];
  public displayedColumnLand: string[] = [];
  public dataSourceLand: ICollateralProperty[] = [];
  public dataSourceBuilding: ICollateralProperty[] = [];
  constructor(private dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.displayedColumnLand = ['no', 'certificateNumber', 'certificateName', 'issueDate', 'dueDate', 'gsNumber', 'area', 'action'];
      this.displayedColumnBuilding = ['no', 'specBuilding', 'floor', 'area', 'action'];
      this.splitData();
    }
  }

  private splitData(): void {
    this.dataSourceBuilding = lodash.filter(this.dataSource, function (o) {
      return o.propertyType === 'BUILDING';
    });
    this.dataSourceLand = lodash.filter(this.dataSource, function (o) {
      return o.propertyType === 'LAND';
    });
  }

  public countTotalArea(data: string): Number {
    let total: number;
    total = 0;

    if (data) {
      const _data = JSON.parse(data);
      if (_data.length > 0) {
        for (let i = 0; i < _data.length; i++) {
          total = total + parseInt(_data[i]['area'], 10);
        }
      }
    }

    return total;
  }

  public openDialog(element: ICollateralProperty): void {
    this.openDialogEvent.emit(element);
  }

  public openDialogFloor(element: ICollateralProperty): void {
    const dialogRef = this.dialog.open(CollateralPropertyBuildingFloorDialogComponent, {
      width: '80vw',
      data: { collateralProperty: element },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collateralPropertyService.update(result).subscribe(res => {
          const idx: number = lodash.findIndex(this.dataSourceBuilding, function (o) {
            return o.id === result.id;
          });
          if (idx) {
            this.dataSourceBuilding[idx] = result;
          }
        });
      }
    });
  }
}
