import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralAppraisalValuationVehicleDialogComponent } from '../dialogs/collateral-appraisal-valuation-vehicle-dialog.component';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { CollateralAppraisalService } from '../../collateral-appraisal.service';
import { STATUS } from 'app/shared/constants/status.constants';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-vehicle',
  templateUrl: './collateral-appraisal-valuation-vehicle.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationVehicleComponent implements OnChanges {
  private _collateral: ICollateral;
  @Input() collateralAppraisal: ICollateralAppraisal;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }
  public dataCollateralAppraisal: ICollateralAppraisal;
  public totalMarketValue: number;
  public roundedtotalMarketValue: number;
  public totalLiquid: number;
  public roundedtotalLiquid: number;
  public collateralProperties: ICollateralProperty[];
  public displayedColumns: string[] = ['no', 'vehType', 'vehicleMarketValue', 'vehiclePercentage', 'vehLiquid', 'action'];
  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    protected collateralAppraisalService: CollateralAppraisalService
  ) {
    this.totalMarketValue = 0;
    this.totalLiquid = 0;
    this.roundedtotalMarketValue = 0;
    this.roundedtotalLiquid = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataCollateralAppraisal = changes.collateralAppraisal.currentValue;
    if (changes['collateral']) {
      this.loadData(this.collateral);
    }
  }

  public reloadData(): void {
    this.loadData(this.collateral);
  }

  public openDialog(colProp: ICollateralProperty = null): void {
    const predicate: object = {
      width: '80vw',
      data: { collateralProperty: colProp, collateralAppraisal: this.dataCollateralAppraisal },
    };
    const dialogRef = this.dialog.open(CollateralAppraisalValuationVehicleDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData(this.collateral);
      }
    });
  }

  private countMarketValue() {
    this.totalMarketValue = 0;

    const countData = [];
    for (let i = 0; i < this.collateralProperties.length; i++) {
      countData.push(this.collateralProperties[i].vehicleMarketValue);
    }
    this.totalMarketValue = countData.length > 0 ? countData.reduce((a, b) => Number(a) + Number(b)) : 0;

    // rounded
    this.roundedtotalMarketValue = this.collateralPropertyService.roundHundred(this.totalMarketValue);
  }

  private countLiquidationValueIndication() {
    const countData = [];
    for (let i = 0; i < this.collateralProperties.length; i++) {
      countData.push(
        Number(this.collateralProperties[i].vehicleMarketValue) * (Number(this.collateralProperties[i].vehiclePercentage) / 100)
      );
    }
    this.totalLiquid = countData.length > 0 ? countData.reduce((a, b) => a + b) : 0;
    this.roundedtotalLiquid = this.collateralPropertyService.roundHundred(this.totalLiquid);
  }

  public deleteVechile(element): void {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.loadData(this.collateral);
    });
  }

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: collateral.id, idPropertyType: CollateralPropertyType.VEHICLE, size: 9999, page: 0 })
      .subscribe(res => {
        this.collateralProperties = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.VEHICLE;
        });

        this.collateralAppraisalService.totalDataDetailVehicle = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.VEHICLE;
        });

        this.countMarketValue();
        this.countLiquidationValueIndication();
      });
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
}
