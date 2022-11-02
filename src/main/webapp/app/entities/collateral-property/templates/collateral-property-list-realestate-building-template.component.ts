import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { REALESTATE_CERTIFICATE_TYPE, REALESTATE_COLLATERAL_DETAIL_TYPE, UOM_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-realestate-building-template',
  templateUrl: './collateral-property-list-realestate-building-template.component.html',
})
export class CollateralPropertyListRealestateBuildingTemplateComponent implements OnInit {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  private _dataSource: ICollateralProperty[];
  private _collateral: ICollateral;
  private _dataBuilding: ICollateralProperty[];

  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  @Input()
  get dataBuilding() {
    return this._dataBuilding;
  }
  set dataBuilding(param: ICollateralProperty[]) {
    this._dataBuilding = param;
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  public areaMeasure: IUom[];
  public certificateType: any;
  public collateralDetailType: any;
  public totalLandArea: Number = 0;
  public displayedColumns: string[] = ['no', 'buildingSpec', 'floors', 'physicalArea', 'action'];
  public animationSettings = { effect: 'Zoom', duration: 400, delay: 0 };

  constructor(private uomService: UomService) {
    this.areaMeasure = [];
    this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.collateralDetailType = REALESTATE_COLLATERAL_DETAIL_TYPE;
  }
  ngOnInit(): void {
    this.loadAreaMeasure();
    console.log('Ini collateral', this._collateral);
    console.log('ini data source', this._dataSource);
  }

  public openDialog(element: ICollateralProperty): void {
    console.log('dialog terbuka', element);
    this.openDialogEvent.emit(element);
  }

  public getObjectSizeUOM(uomId: string): string {
    if (this.areaMeasure.length > 0) {
      for (let i = 0; i < this.areaMeasure.length; i++) {
        if (this.areaMeasure[i].id === uomId) {
          return this.areaMeasure[i].description;
        }
      }
    }
    return '';
  }

  private loadAreaMeasure(): void {
    this.uomService
      .queryFilterBy({
        idUomType: UOM_TYPE.AREAMEASURE,
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.areaMeasure = res.body;
      });
  }

  public changeBuildingFacility(event: MatCheckboxChange, facilityType: string): void {
    const value: boolean = event.checked;
    if (facilityType === 'electricity') {
      this.collateral.attributes['buildingFacElectricity'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'telephone') {
      this.collateral.attributes['buildingFacTelephone'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'ac') {
      this.collateral.attributes['buildingFacAc'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'wh') {
      this.collateral.attributes['buildingFacWaterHeater'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'pam') {
      this.collateral.attributes['buildingFacCleanWater'] = value === true ? 'yes' : 'no';
    }

    console.log('xxx', this.collateral);
  }

  public countTotalArea(data: string): Number {
    let total: number;
    total = 0;

    if (data) {
      const _data = JSON.parse(data);
      if (_data.length > 0) {
        for (let i = 0; i < _data.length; i++) {
          total = total + parseInt(_data[i]['area'], 10);
        }
      }
    }

    return total;
  }
}
