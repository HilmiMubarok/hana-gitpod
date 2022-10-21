import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { IUom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';
import { REALESTATE_CERTIFICATE_TYPE, REALESTATE_COLLATERAL_DETAIL_TYPE, UOM_TYPE } from 'app/shared/constants/base.constants';
import { ICollateralProperty } from '../collateral-property.model';

@Component({
  selector: 'jhi-collateral-property-list-realestate-two-template',
  templateUrl: './collateral-property-list-realestate-two-template.component.html',
})
export class CollateralPropertyListRealEstateTwoTemplateComponent implements OnInit {
  @Output() openDialogEvent = new EventEmitter<ICollateralProperty>();

  private _dataSource: ICollateralProperty[];
  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProperty[]) {
    this._dataSource = param;
  }

  public areaMeasure: IUom[];
  public certificateType: any;
  public collateralDetailType: any;
  public displayColumns: string[] = [
    'no',
    'detailType',
    'certificateType',
    'certificateNo',
    'address',
    'quantitySize',
    'marketValuePhysic',
    'marketValueIMB',
    'marketValueTataKota',
    'marketValueIndependent',
    'action',
  ];

  constructor(private uomService: UomService) {
    this.areaMeasure = [];
    this.certificateType = REALESTATE_CERTIFICATE_TYPE;
    this.collateralDetailType = REALESTATE_COLLATERAL_DETAIL_TYPE;
  }
  ngOnInit(): void {
    this.loadAreaMeasure();
  }

  public openDialog(element: ICollateralProperty): void {
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
}
