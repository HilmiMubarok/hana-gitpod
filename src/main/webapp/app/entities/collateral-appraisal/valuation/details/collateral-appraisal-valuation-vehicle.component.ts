import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { TemplateService } from 'app/layouts/template/template.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-vehicle',
  templateUrl: './collateral-appraisal-valuation-vehicle.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationVehicleComponent implements OnChanges, OnInit {
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
  public roleCondition = '';
  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    protected collateralAppraisalService: CollateralAppraisalService,
    private templateService: TemplateService
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

  ngOnInit(): void {
    this.getRole();
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

  // check for role
  public getRole() {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.roleCondition = newPos.positionTypeId;
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

  // Delete Confirmation
  public deleteVechile(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Building Info',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.collateralPropertyService.delete(element.id).subscribe(() => {
          this.loadData(this.collateral);
        });
      }
    });
  }

  // public deleteVechile(element): void {
  //   this.collateralPropertyService.delete(element.id).subscribe(() => {
  //     this.loadData(this.collateral);
  //   });
  // }

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
        this.loadDataValuation();
      });
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
  public hideButtonRoleBased() {
    if (this.roleCondition === 'TL' || this.roleCondition === 'APR_DEPT_HEAD' || this.roleCondition === 'APR_DH') {
      return true;
    } else {
      return false;
    }
  }
  public loadDataValuation(): void {
    this.collateralPropertyService.getValuationAndProperties(this.collateral, this.collateralAppraisal.id).subscribe(
      (result: any[]) => {
        this.collateralAppraisalService.valuationData = result;
      },
      error => {
        console.error('Error fetching valuations:', error);
      }
    );
  }
}
