import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { CollateralAppraisalValuationPropertyDialogComponent } from '../dialogs/collateral-appraisal-valuation-property-dialog.component';
import { CollateralAppraisalValuationLandDialogComponent } from '../dialogs/collateral-appraisal-valuation-land-dialog.component';

@Component({
  selector: 'jhi-collateral-appraisal-valuation-property',
  templateUrl: './collateral-appraisal-valuation-property.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationPropertyComponent implements OnChanges {
  @Input() collateral: ICollateral;

  public totalLandArea: number;
  public totalMarketValueIMB: number;
  public totalMarketValueTataKota: number;
  public totalMarketValueBuilding: number;
  public totalLiquidLand: number;
  public totalLiquidLandIMB: number;
  public totalLiquidLandTataKota: number;
  public totalLiquidIMB: number;
  public totalLiquidTataKota: number;
  public totalLiquidBuilding: number;
  public collateralProperties: ICollateralProperty[];
  public collateralPropertiesLand: ICollateralProperty[];
  private displayBasicColumns: string[] = [
    'marketValueArea',
    'marketValue',
    'percentage',
    'liquidVal',
    'marketValueAreaIMB',
    'marketValueIMB',
    'percentageIMB',
    'liquidValIMB',
    'marketValueAreaTataKota',
    'marketValueTataKota',
    'percentageTataKota',
    'liquidValTataKota',
  ];
  public displayedColumnsLand: string[] = [
    'no',
    'certificateNo',
    'certificateName',
    'issueDate',
    'dueDate',
    'suratUkurNum',
    'area',
    ...this.displayBasicColumns,
    'action',
  ];
  public displayedColumns: string[] = ['no', 'collateralObject', 'area', ...this.displayBasicColumns, 'action'];

  constructor(public dialog: MatDialog, private collateralPropertyService: CollateralPropertyService) {
    this.collateralPropertiesLand = [];

    this.totalMarketValueBuilding = 0;

    this.totalLiquidLand = 0;
    this.totalLiquidLandIMB = 0;
    this.totalLiquidLandTataKota = 0;

    this.totalLiquidBuilding = 0;
    this.totalLandArea = 0;

    this.totalMarketValueIMB = 0;
    this.totalLiquidIMB = 0;

    this.totalMarketValueTataKota = 0;
    this.totalLiquidTataKota = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.loadData(this.collateral);
    }
  }

  public openDialogEditCollateral(element: ICollateral): void {
    const dialogRef = this.dialog.open(CollateralAppraisalValuationLandDialogComponent, {
      width: '80vw',
      data: { collateral: element, area: this.totalLandArea },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.collateral = res;
        this.countAllTotalAndLiquid();
      }
    });
  }

  private countAllTotalAndLiquid(): void {
    this.totalLiquidLand = 0;
    this.totalLiquidLandIMB = 0;
    this.totalLiquidLandTataKota = 0;

    // for the land
    if (this.collateral.percentage) {
      this.totalLiquidLand = this.collateral.marketValue * (this.collateral.percentage / 100);
      this.totalLiquidLandTataKota = this.collateral.marketValueTataKota * (this.collateral.percentage / 100);
      this.totalLiquidLandIMB = this.collateral.marketValueImb * (this.collateral.percentage / 100);
    }

    if (this.collateralProperties.length > 0) {
      this.totalMarketValueBuilding = 0;
      this.totalMarketValueIMB = 0;
      this.totalMarketValueTataKota = 0;

      this.totalLiquidBuilding = 0;
      this.totalLiquidTataKota = 0;
      this.totalLiquidIMB = 0;

      for (let i = 0; i < this.collateralProperties.length; i++) {
        const item: ICollateralProperty = this.collateralProperties[i];

        // count market value
        if (item.propertyMarketValue) {
          this.totalMarketValueBuilding = this.totalMarketValueBuilding + item.propertyMarketValue;
        }

        if (item.propertyMarketValueIMB) {
          this.totalMarketValueIMB = this.totalMarketValueIMB + item.propertyMarketValueIMB;
        }

        if (item.propertyMarketValueTataKota) {
          this.totalMarketValueTataKota = this.totalMarketValueTataKota + item.propertyMarketValueTataKota;
        }

        // count liquid
        if (item.propertyPercentage) {
          this.totalLiquidBuilding = this.totalLiquidBuilding + item.propertyMarketValue * (item.propertyPercentage / 100);
        }

        if (item.propertyPercentageIMB) {
          this.totalLiquidIMB = this.totalLiquidIMB + item.propertyMarketValueIMB * (item.propertyPercentageIMB / 100);
        }

        if (item.propertyPercentageTataKota) {
          this.totalLiquidTataKota = this.totalLiquidTataKota + item.propertyMarketValueTataKota * (item.propertyPercentageTataKota / 100);
        }
      }
    }
  }

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({
        idCollateral: collateral.id,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralProperties = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.BUILDING;
        });
        this.collateralPropertiesLand = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.LAND;
        });
        this.countTotalAreaLand();
        this.countAllTotalAndLiquid();
      });
  }

  public countTotalAreaLand(): void {
    let total: number;
    total = 0;

    if (this.collateralPropertiesLand.length > 0) {
      for (let i = 0; i < this.collateralPropertiesLand.length; i++) {
        const item: ICollateralProperty = this.collateralPropertiesLand[i];
        total = total + item.landSizePerCertificate;
      }
    }
    this.totalLandArea = total;
  }

  public countTotalArea(element: ICollateralProperty): number {
    let total: number;
    total = 0;

    if (element.propertyType === CollateralPropertyType.BUILDING) {
      if (lodash.has(element.attributes, 'floors')) {
        const floors: object[] = JSON.parse(element.attributes['floors']);
        if (floors.length > 0) {
          for (let i = 0; i < floors.length; i++) {
            const floor: object = floors[i];
            total = total + parseInt(floor['area'], 10);
          }
        }
      }
    }

    if (element.propertyType === CollateralPropertyType.LAND) {
      return element.landSizePerCertificate;
    }

    return total;
  }

  public reloadData(): void {
    this.loadData(this.collateral);
  }

  public openDialog(element: ICollateralProperty): void {
    const predicate: object = {
      width: '80vw',
      data: {
        collateralProperty: element,
      },
    };

    const dialogRef = this.dialog.open(CollateralAppraisalValuationPropertyDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData(this.collateral);
      }
    });
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public fnCountTotalLiquid(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValue && param[i].propertyPercentage) {
          result = result + param[i].propertyMarketValue * (param[i].propertyPercentage / 100);
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalLiquidIMB(param: ICollateralProperty[]): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValueIMB && param[i].propertyPercentageIMB) {
          result = result + param[i].propertyMarketValueIMB * (param[i].propertyPercentageIMB / 100);
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalLiquidTataKota(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValueTataKota && param[i].propertyPercentageTataKota) {
          result = result + param[i].propertyMarketValueTataKota * (param[i].propertyPercentageTataKota / 100);
        }
      }
      return result;
    }
    return 0;
  }

  // ---------------------------------------------------------------------------------

  public fnCountTotalMVTataKota(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValueTataKota) {
          result = result + param[i].propertyMarketValueTataKota;
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalMVIMB(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValueIMB) {
          result = result + param[i].propertyMarketValueIMB;
        }
      }
      return result;
    }
    return 0;
  }

  public fnCountTotalMV(param: ICollateralProperty[] = null): number {
    if (param.length > 0 && param) {
      let result: number;
      result = 0;
      for (let i = 0; i < param.length; i++) {
        if (param[i].propertyMarketValue) {
          result = result + param[i].propertyMarketValue;
        }
      }
      return result;
    }
    return 0;
  }

  public roundHundred(value) {
    let round: number;
    round = 0;
    if (value < 500000) {
      round = 1000000;
    } else {
      round = Math.round(value / 1000000) * 1000000;
    }
    return round;
  }

  public print() {
    console.log('Hasil : ', this.roundHundred(1758000));
  }
}
