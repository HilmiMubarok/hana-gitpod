import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import lodash from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Floor, IFloor } from 'app/entities/collateral-appraisal/collateral/dialogs/dialog.model';

@Component({
  selector: 'jhi-collateral-property-building-floor-dialog',
  templateUrl: './collateral-property-building-floor-dialog.component.html',
})
export class CollateralPropertyBuildingFloorDialogComponent implements OnInit {
  public floor: IFloor = new Floor();
  public floors: any = new MatTableDataSource<object[]>();
  public collateralProp: ICollateralProperty = new CollateralProperty();
  public displayedColumns: string[] = ['no', 'floor', 'area', 'action'];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateralProperty: ICollateralProperty;
    },
    private _snackBar: MatSnackBar,
    private _dialog: MatDialogRef<CollateralPropertyBuildingFloorDialogComponent>,
    private collateralPropertyService: CollateralPropertyService
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.floor.area = 0;
    this.floor.floor = 1;
  }

  ngOnInit(): void {
    this.floors.data = JSON.parse(this.collateralProp.attributes['floors']);
  }

  public addFloor(): void {
    const floorNumber: number = this.floor.floor;
    const exist: object = lodash.find(this.floors.data, function (o) {
      return o['floor'] === floorNumber;
    });

    if (exist) {
      this._snackBar.open('This floor already exist', null, {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000,
      });
    } else {
      const _floors: object[] = this.floors.data;
      const _floor: IFloor = Object.assign({}, this.floor);
      _floors.push(_floor);

      this.floors.data = _floors;
    }
  }

  public deleteFloor(data): void {
    const deletedItem = this.floors.data.filter(item => item.floor !== data.floor);
    this.floors.data = deletedItem;
  }

  public save(): void {
    this.collateralProp.attributes['floors'] = this.floors.data;
    this.collateralProp.attributes['floors'] = JSON.stringify(this.collateralProp.attributes['floors']);
    if (this.collateralProp.id) {
      // update
      this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    } else {
      // create
      this.collateralPropertyService.create(this.collateralProp).subscribe(res => {
        this._dialog.close(res.body);
      });
    }
  }
}
