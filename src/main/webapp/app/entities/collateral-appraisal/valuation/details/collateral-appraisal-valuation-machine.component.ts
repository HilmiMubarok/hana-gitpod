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
    protected collateralappraisalService: CollateralAppraisalService
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

  public deleteMechine(element): void {
    this.collateralPropertyService.delete(element.id).subscribe(() => {
      this.loadData(this.collateral);
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

    this.countMarketValue();
    this.countLiquidationValueIndication();
  }

  private countMarketValue() {
    // rounded
    const split = this.totalMarketValue.toLocaleString('en-US').split(',');
    if (Number(split[0]) === 0) {
      this.roundedtotalMarketValue = 0;
    } else {
      if (split.length < 3) {
        if (Number(split[0]) < 500) {
          this.roundedtotalMarketValue = 0;
        } else {
          if (Number(split[1]) < 500) {
            if (Number(split[0]) > 499) {
              this.roundedtotalMarketValue = 1000000;
            } else {
              this.roundedtotalMarketValue = Number(split[0] + '000000');
            }
          } else {
            const nilai = [];
            for (let j = 1; j < split.length; j++) {
              nilai.push('000');
            }
            this.roundedtotalMarketValue = Number(Number(split[0]) + Number(1) + nilai.join(''));
          }
        }
      } else {
        const rounded = [];
        for (let i = split.length - 1; i >= 0; i--) {
          rounded.push(split[i]);
        }

        if (Number(split[split.indexOf(rounded[1])]) < 500) {
          const nilai = [];
          for (let j = 0; j < split.length - 2; j++) {
            nilai.push(split[j]);
          }
          this.roundedtotalMarketValue = Number(nilai.join('') + '000000');
        } else {
          const nilai = [];
          for (let j = 0; j < split.length - 2; j++) {
            nilai.push(split[j]);
          }
          this.roundedtotalMarketValue = Number(Number(nilai.join('')) + 1 + '000000');
        }
      }
    }
  }

  private countLiquidationValueIndication() {
    const split = this.totalLiquid.toLocaleString('en-US').split(',');
    if (Number(split[0]) === 0) {
      this.roundedtotalLiquid = 0;
    } else {
      if (split.length < 3) {
        if (Number(split[0]) < 500) {
          this.roundedtotalLiquid = 0;
        } else {
          if (Number(split[1]) < 500) {
            if (Number(split[0]) > 499) {
              this.roundedtotalLiquid = 1000000;
            } else {
              this.roundedtotalLiquid = Number(split[0] + '000000');
            }
          }
        }
      } else {
        const rounded = [];
        for (let i = split.length - 1; i >= 0; i--) {
          rounded.push(split[i]);
        }

        if (Number(split[split.indexOf(rounded[1])]) < 500) {
          const nilai = [];
          for (let j = 0; j < split.length - 2; j++) {
            nilai.push(split[j]);
          }
          this.roundedtotalLiquid = Number(nilai.join('') + '000000');
        } else {
          const nilai = [];
          for (let j = 0; j < split.length - 2; j++) {
            nilai.push(split[j]);
          }
          this.roundedtotalLiquid = Number(Number(nilai.join('')) + 1 + '000000');
        }
      }
    }
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
}
