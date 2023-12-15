import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';
import { ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
@Component({
  selector: 'jhi-collateral-appraisal-valuation-property-dialog',
  templateUrl: './collateral-appraisal-valuation-property-dialog.component.html',
  styleUrls: ['../collateral-appraisal-valuation.scss'],
})
export class CollateralAppraisalValuationPropertyDialogComponent implements OnInit {
  public collateralProp: ICollateralProperty;
  public collateralProperties: ICollateralProperty[];
  public collateralAppraisal: ICollateralAppraisal;
  public certificates: ICollateralLandAttribute[];
  public totalCountAreaLand: number;
  public totalAreaTataKotaBuilding: number;

  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    private collateralPropertyService: CollateralPropertyService,
    private _dialog: MatDialogRef<CollateralAppraisalValuationPropertyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collateralAppraisal: ICollateralAppraisal; collateralProperty: ICollateralProperty }
  ) {
    this.collateralProp = this.data.collateralProperty;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }
  ngOnInit(): void {
    this.getRole();
    this.cekData();
    this.getTotalAreaCertificate();
    // this.countTotalAreaTataKotaBuilding();

    if (this.collateralProp.propertyType === CollateralPropertyType.LAND) {
      this.calTotalmarket();
      this.calTotalmarketTataKotaLand();
      this.calTotalmarketValueLand();
    }
    if (this.collateralProp.propertyType === CollateralPropertyType.BUILDING) {
      this.calTotalmarketIMBBuilding();
      this.calTotalmarketTataKotaBuilding();
      this.calTotalmarketValueBilding();
    }
  }

  public getRole() {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
  }

  public checkRole(param): void {
    if (param === 'SURVEYOR' || param === 'TL' || param === 'APR_DEPT_HEAD') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.collateralProp.propertyType === CollateralPropertyType.LAND) {
  //     this.calTotalmarket();
  //     this.calTotalmarketTataKotaLand();
  //   } else {
  //     this.calTotalmarketIMBBuilding();
  //     this.calTotalmarketTataKotaBuilding();
  //   }
  // }

  public cancel(): void {
    this._dialog.close(this.collateralProp);
  }
  public save(): void {
    this.collateralPropertyService.update(this.collateralProp).subscribe(res => {
      this._dialog.close(res.body);
    });
  }

  public getMarketValueImbLand() {
    this.collateralProp.propertyMarketValue = this.collateralProp.landSizePerCertificate * this.collateralProp.propertyMarketValuePerMeter;
  }

  public getMarketValueImbBuilding() {
    this.collateralProp.propertyMarketValue = this.collateralProp.imbArea * this.collateralProp.propertyMarketValuePerMeter;
  }

  public totalArea: number;
  public countTotalArea(): number {
    let total = 0;
    if (this.collateralProp.propertyType === CollateralPropertyType.BUILDING) {
      if (lodash.has(this.collateralProp.attributes, 'floors')) {
        const floors: object[] = JSON.parse(this.collateralProp.attributes['floors']);
        if (floors.length > 0) {
          for (let i = 0; i < floors.length; i++) {
            const floor: object = floors[i];
            const floorArea: number = parseFloat(floor['area']);
            total += floorArea;
          }
        }
      }
    }
    // toFixed(2) untuk mengatur angka desimal ke 2 di belakang koma
    return parseFloat(total.toFixed(2));
  }

  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
  // public calTotalmarket(): Number {
  //   this.collateralProp.propertyMarketValue = this.collateralProp.propertyMarketValuePerMeter * this.countTotalArea();
  //   return this.collateralProp.propertyMarketValue;
  // }
  public calTotalmarket(): Number {
    this.collateralProp.propertyMarketValueIMB =
      this.collateralProp.landSizePerCertificate * this.collateralProp.propertyMarketValueIMBPerMeter;

    return this.collateralProp.propertyMarketValueIMB;
  }

  public calTotalmarketTataKotaLand(): Number {
    const totalAreaCertificate =
      this.totalCountAreaLand - this.collateralAppraisal.collateral.truncatedArea - this.collateralAppraisal.collateral.publicFacilities;
    // this.collateralProp.propertyMarketValueTataKota =
    //   this.collateralProp.landSizePerCertificate * this.collateralProp.propertyMarketValueTataKotaPerMeter;
    this.collateralProp.propertyMarketValueTataKota = this.collateralProp.propertyMarketValueTataKotaPerMeter * totalAreaCertificate;

    return this.collateralProp.propertyMarketValueTataKota;
  }

  public calTotalmarketIMBBuilding(): Number {
    this.collateralProp.propertyMarketValueIMB = this.collateralProp.propertyMarketValueIMBPerMeter * this.collateralProp.imbArea;

    return this.collateralProp.propertyMarketValueIMB;
  }
  public calTotalmarketTataKotaBuilding(): Number {
    // this.collateralProp.propertyMarketValueTataKota = this.collateralProp.propertyMarketValueTataKotaPerMeter * this.countTotalArea();
    this.collateralProp.propertyMarketValueTataKota =
      this.collateralProp.propertyMarketValueTataKotaPerMeter * this.collateralProp.propertyAreaTataKota;
    return this.collateralProp.propertyMarketValueTataKota;
  }

  public calTotalmarketValueLand(): Number {
    this.collateralProp.propertyMarketValue = this.collateralProp.landSizePerCertificate * this.collateralProp.propertyMarketValuePerMeter;

    return this.collateralProp.propertyMarketValue;
  }

  public calTotalmarketValueBilding(): Number {
    this.collateralProp.propertyMarketValue = this.countTotalArea() * this.collateralProp.propertyMarketValuePerMeter;

    return this.collateralProp.propertyMarketValue;
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close(this.collateralProp);
      }
    });
  }

  public cekData() {
    if (typeof this.collateralAppraisal.collateral.attributes['landCertificates'] === 'string') {
      let data = '';
      let i = 0;
      while (typeof data === 'string') {
        data = JSON.parse(this.collateralAppraisal.collateral.attributes['landCertificates']);
        console.log(data, 'parse ke', i);
        i++;
        if (i > 1000) {
          this.collateralAppraisal.collateral.attributes['landCertificates'] = [];
          this.certificates = this.collateralAppraisal.collateral.attributes['landCertificates'];
          break;
        } else if (typeof data !== 'string') {
          if (JSON.parse(this.collateralAppraisal.collateral.attributes['landCertificates']).length > 0) {
            this.certificates = data;
          } else {
            this.collateralAppraisal.collateral.attributes['landCertificates'] = [];
            this.certificates = this.collateralAppraisal.collateral.attributes['landCertificates'];
          }
        }
      }
    } else if (
      typeof this.collateralAppraisal.collateral.attributes['landCertificates'] !== 'string' &&
      typeof this.collateralAppraisal.collateral.attributes['landCertificates'] === 'object'
    ) {
      console.log(this.collateralAppraisal.collateral.attributes['landCertificates']);
      this.certificates = this.collateralAppraisal.collateral.attributes['landCertificates'];
    }
  }

  public getTotalAreaCertificate() {
    this.totalCountAreaLand = 0;
    if (this.certificates?.length > 0) {
      for (let j = 0; j < this.certificates.length; j++) {
        if (this.certificates.length !== undefined) {
          this.totalCountAreaLand = this.totalCountAreaLand + Number(this.certificates[j].certArea);
        }
      }
    }
    return this.totalCountAreaLand;
  }
}
