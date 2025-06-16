import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralAppraisalValuationMachineDialogComponent } from '../dialogs/collateral-appraisal-valuation-machine-dialog.component';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { ICollateralAppraisal, CollateralAppraisal } from '../../collateral-appraisal.model';
import { CollateralAppraisalService } from '../../collateral-appraisal.service';
import { STATUS } from 'app/shared/constants/status.constants';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-machine',
  templateUrl: './collateral-appraisal-valuation-machine.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationMachineComponent implements OnChanges {
  @Input() collateral: ICollateral;
  @Input() collateralAppraisal: ICollateralAppraisal;

  public dataCollateralAppraisal: ICollateralAppraisal;
  public totalMarketValue: number;
  public totalLiquid: number;
  public roundedtotalMarketValue: number;
  public roundedtotalLiquid: number;
  public collateralProperties: ICollateralProperty[];
  public displayedColumns: string[] = [
    'no',
    'machineName',
    'brand',
    'madeBy',
    'mfgDate',
    'marketValue',
    'liquidVal',
    'percentage',
    'action',
  ];

  constructor(
    public dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    protected collateralappraisalService: CollateralAppraisalService,
    public collateralAppraisalService: CollateralAppraisalService
  ) {
    this.totalMarketValue = 0;
    this.totalLiquid = 0;
    this.roundedtotalMarketValue = 0;
    this.roundedtotalLiquid = 0;
    this.dataCollateralAppraisal = new CollateralAppraisal();
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

    const dialogRef = this.dialog.open(CollateralAppraisalValuationMachineDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData(this.collateral);
      }
    });
  }

  // Delete Confirmation
  public deleteMechine(element): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Collateral Object',
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

  // public deleteMechine(element): void {
  //   this.collateralPropertyService.delete(element.id).subscribe(() => {
  //     this.loadData(this.collateral);
  //   });
  // }

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

    this.countMarketValue();
    this.countLiquidationValueIndication();
  }

  private countMarketValue() {
    this.roundedtotalMarketValue = this.collateralPropertyService.roundHundred(this.totalMarketValue);
  }

  private countLiquidationValueIndication() {
    this.roundedtotalLiquid = this.collateralPropertyService.roundHundred(this.totalLiquid);
  }

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: collateral.id, size: 9999, page: 0, idPropertyType: CollateralPropertyType.MACHINE })
      .subscribe(res => {
        this.collateralProperties = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.MACHINE;
        });
        this.collateralappraisalService.totalDataDetailMachine = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.MACHINE;
        });
        this.countingData();
        this.loadDataValuation();
      });
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
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
