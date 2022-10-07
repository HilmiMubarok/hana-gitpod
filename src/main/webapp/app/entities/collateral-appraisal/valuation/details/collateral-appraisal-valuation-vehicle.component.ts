import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralAppraisalValuationMachineDialogComponent } from '../dialogs/collateral-appraisal-valuation-machine-dialog.component';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralAppraisalValuationVehicleDialogComponent } from '../dialogs/collateral-appraisal-valuation-vehicle-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-vehicle',
  templateUrl: './collateral-appraisal-valuation-vehicle.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationVehicleComponent implements OnChanges {
  @Input() collateral: ICollateral;

  public totalMarketValue: number;
  public roundedtotalMarketValue: number;
  public totalLiquid: number;
  public roundedtotalLiquid: number;
  public collateralProperties: ICollateralProperty[];
  public displayedColumns: string[] = ['no', 'vehModel', 'vehicleMarketValue', 'vehiclePercentage', 'vehLiquid', 'action'];
  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {
    this.totalMarketValue = 0;
    this.totalLiquid = 0;
    this.roundedtotalMarketValue = 0;
    this.roundedtotalLiquid = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
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
      data: { collateralProperty: colProp },
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
    this.totalMarketValue = countData.reduce((a, b) => Number(a) + Number(b));

    // rounded
    const split = this.totalMarketValue.toLocaleString('en-US').split(',');
    if (Number(split[1]) < 500) {
      this.roundedtotalMarketValue = Number(split[0] + '000000');
    } else {
      this.roundedtotalMarketValue = Number(Number(split[0] + 1) + '000000');
    }
  }

  private countLiquidationValueIndication() {
    const countData = [];
    for (let i = 0; i < this.collateralProperties.length; i++) {
      countData.push(
        Number(this.collateralProperties[i].vehicleMarketValue) * (Number(this.collateralProperties[i].vehiclePercentage) / 100)
      );
    }
    this.totalLiquid = countData.reduce((a, b) => a + b);

    const split = this.totalLiquid.toLocaleString('en-US').split(',');
    if (Number(split[1]) < 500) {
      this.roundedtotalLiquid = Number(split[0] + '000000');
    } else {
      this.roundedtotalLiquid = Number(Number(split[0] + 1) + '000000');
    }
  }

  public deleteVechile(element): void {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.loadData(this.collateral);
    });
  }

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, size: 9999 }).subscribe(res => {
      this.collateralProperties = lodash.filter(res.body, function (o) {
        return o.propertyType === CollateralPropertyType.VEHICLE;
      });

      this.countMarketValue();
      this.countLiquidationValueIndication();
    });
  }
}
