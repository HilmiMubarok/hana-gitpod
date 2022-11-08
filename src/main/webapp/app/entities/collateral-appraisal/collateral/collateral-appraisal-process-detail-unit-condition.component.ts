import { Component, Output, ChangeDetectorRef, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { ICollateralProperty, CollateralProperty } from '../../collateral-property/collateral-property.model';
import { CollateralVehicleDialogComponent } from './dialogs/collateral-vehicle-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-unit-condition',
  templateUrl: './collateral-appraisal-process-detail-unit-condition.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-unit-condition.css'],
})
export class CollateralAppraisalDetailProcessUnitConditionComponent implements OnChanges {
  @Input()
  public collateralId: number;

  @Input()
  public collateralAppraisalId: number;

  public collateralProperties: ICollateralProperty[];
  public displayedColumns: string[] = [
    'no',
    'bpkbNum',
    'ownerName',
    'vehicleNum',
    'stnkNum',
    'chasisNum',
    'machineNum',
    'invNum',
    'year',
    'action',
  ];

  constructor(private collateralPropertyService: CollateralPropertyService, private dialog: MatDialog) {
    this.collateralProperties = new Array<ICollateralProperty>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId'] && changes['collateralAppraisalId']) {
      this.getCollateralPropertyByCollateralId(this.collateralId);
    }
  }

  private getCollateralPropertyByCollateralId(id: number): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: id, size: 9999, page: 0, idPropertyType: CollateralPropertyType.VEHICLE })
      .subscribe(res => {
        this.collateralProperties = res.body;
      });
  }

  public openDialog(colProp: ICollateralProperty = null): void {
    const predicate = {
      width: '90vw',
    };

    if (colProp) {
      predicate['data'] = { collateralProperty: colProp };
    } else {
      const _colProp: ICollateralProperty = new CollateralProperty();
      _colProp.collateralId = this.collateralId;
      _colProp.propertyType = CollateralPropertyType.VEHICLE;
      predicate['data'] = { collateralProperty: _colProp };
    }

    const dialogRef = this.dialog.open(CollateralVehicleDialogComponent, predicate);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCollateralPropertyByCollateralId(this.collateralId);
      }
    });
  }
  public deleteVechiles(element): void {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.getCollateralPropertyByCollateralId(this.collateralId);
    });
  }
}
