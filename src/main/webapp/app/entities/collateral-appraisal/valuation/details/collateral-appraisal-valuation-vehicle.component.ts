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
})
export class CollateralAppraisalValuationVehicleComponent implements OnChanges {
  @Input() collateral: ICollateral;

  public totalMarketValue: number;
  public totalLiquid: number;
  public collateralProperties: ICollateralProperty[];
  public displayedColumns: string[] = ['no', 'vehModel', 'vehicleMarketValue', 'vehiclePercentage', 'vehLiquid', 'action'];
  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {
    this.totalMarketValue = 0;
    this.totalLiquid = 0;
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

  private countingData(): void {
    if (this.collateralProperties.length > 0) {
      this.totalMarketValue = 0;
      this.totalLiquid = 0;
      for (let i = 0; i < this.collateralProperties.length; i++) {
        const item: ICollateralProperty = this.collateralProperties[i];
        if (item.machineMarketValue) {
          this.totalMarketValue = this.totalMarketValue + item.machineMarketValue;
        }

        if (item.machineMarketValue && item.machinePercentage) {
          this.totalLiquid = this.totalLiquid + item.machineMarketValue * (item.machinePercentage / 100);
        }
      }
    }
  }

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService.queryFilterBy({ idCollateral: collateral.id, size: 9999 }).subscribe(res => {
      this.collateralProperties = lodash.filter(res.body, function (o) {
        return o.propertyType === CollateralPropertyType.VEHICLE;
      });

      this.countingData();
    });
  }
}
