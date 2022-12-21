import { Component, Output, ChangeDetectorRef, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { ICollateralProperty, CollateralProperty } from '../../collateral-property/collateral-property.model';
import { CollateralAppraisalService } from '../collateral-appraisal.service';
import { CollateralVehicleDialogComponent } from './dialogs/collateral-vehicle-dialog.component';
import { STATUS } from 'app/shared/constants/status.constants';
import { ICollateralAppraisal } from '../collateral-appraisal.model';
@Component({
  selector: 'jhi-collateral-appraisal-process-detail-unit-condition',
  templateUrl: './collateral-appraisal-process-detail-unit-condition.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-unit-condition.css'],
})
export class CollateralAppraisalDetailProcessUnitConditionComponent implements OnChanges {
  @Input()
  public collateralAppraisal: ICollateralAppraisal;
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

  constructor(
    private collateralPropertyService: CollateralPropertyService,
    private dialog: MatDialog,
    private collateralAppraisalService: CollateralAppraisalService
  ) {
    this.collateralProperties = new Array<ICollateralProperty>();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralId'] && changes['collateralAppraisalId']) {
      this.getCollateralPropertyByCollateralId(this.collateralId);
    }
  }

  public getCollateralPropertyByCollateralId(id: number): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: id, size: 9999, page: 0, idPropertyType: CollateralPropertyType.VEHICLE })
      .subscribe(res => {
        this.collateralProperties = res.body;

        this.collateralAppraisalService.totalDataDetailVehicle = res.body;
      });
  }

  public openDialog(colProp: ICollateralProperty = null): void {
    const predicate = {
      width: '90vw',
      collateralAppraisal: this.collateralAppraisal,
    };

    if (colProp) {
      predicate['data'] = { collateralProperty: colProp, collateralAppraisal: this.collateralAppraisal };
    } else {
      const _colProp: ICollateralProperty = new CollateralProperty();
      _colProp.collateralId = this.collateralId;
      _colProp.propertyType = CollateralPropertyType.VEHICLE;
      predicate['data'] = { collateralProperty: _colProp, collateralAppraisal: this.collateralAppraisal };
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
  gakbisa() {
    if (this.collateralAppraisal?.statusId === STATUS.APPROVE) {
      return true;
    }
    return false;
  }
}
