import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { REALESTATE_CERTIFICATE_TYPE, REALESTATE_COLLATERAL_DETAIL_TYPE, UOM_TYPE } from 'app/shared/constants/base.constants';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { ICollateralProperty } from '../collateral-property.model';
import { CollateralPropertyService } from '../collateral-property.service';
import { CollateralPropertyVehicleDialogComponent } from '../dialogs/collateral-property-vehicle-dialog.component';

@Component({
  selector: 'jhi-collateral-property-list-vehicle-template',
  templateUrl: './collateral-property-list-vehicle-template.component.html',
})
export class CollateralPropertyListVehicleTemplateComponent implements OnInit, OnChanges {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  private _collateral: ICollateral;
  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  public collateralProperties: ICollateralProperty[];
  public areaMeasure: IUom[];
  public certificateType: any;
  public collateralDetailType: any;
  public displayColumns: string[] = [
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

  constructor(public dialog: MatDialog, private uomService: UomService, private collateralPropertyService: CollateralPropertyService) {
    this.areaMeasure = [];
    this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.collateralDetailType = REALESTATE_COLLATERAL_DETAIL_TYPE;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.loadData(this.collateral);
    }
  }
  ngOnInit(): void {
    this.loadAreaMeasure();
  }

  public reloadData(): void {
    this.loadData(this.collateral);
  }

  public openDialog(colProp: ICollateralProperty = null): void {
    const predicate: object = {
      width: '80vw',
      data: { collateralProperty: colProp },
    };
    const dialogRef = this.dialog.open(CollateralPropertyVehicleDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadData(this.collateral);
      }
    });
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

  public loadData(collateral: ICollateral): void {
    this.collateralPropertyService
      .queryFilterBy({ idCollateral: collateral.id, idPropertyType: CollateralPropertyType.VEHICLE, size: 9999, page: 0 })
      .subscribe(res => {
        this.collateralProperties = lodash.filter(res.body, function (o) {
          return o.propertyType === CollateralPropertyType.VEHICLE;
        });
      });
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
}
