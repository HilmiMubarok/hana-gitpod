import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ICollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import {
  COLLATERAL_TYPE,
  SUB_COLLATERAL_TYPE_MACHINE,
  SUB_COLLATERAL_TYPE_PROPERTY,
  SUB_COLLATERAL_TYPE_REALESTATE,
  SUB_COLLATERAL_TYPE_VEHICLE,
} from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-collateral-type-dialog',
  templateUrl: './collateral-type-dialog.component.html',
})
export class CollateralTypeDialogComponent implements OnInit {
  public _collateral: ICollateral;
  public _disabledOpt: any;
  @Input()
  get collateral() {
    return this._collateral;
  }

  set collateral(item: ICollateral) {
    this._collateral = item;
  }

  @Input()
  get disabledOpt() {
    return this._disabledOpt;
  }

  set disabledOpt(item: any) {
    this._disabledOpt = item;
  }

  // public lovReal = [];
  public lovLsbc = [];
  public lovTd = [];
  public lovHeavy = [];
  public lovSecured = [];
  public lovShop = [];
  public lovFactory = [];
  public lovColcode = [];
  public lovHotel = [];
  public lovKiosk = [];
  public lovHouse = [];
  public lovApartment = [];
  public lovLand = [];

  public colProposeVal = '';
  public subCollateralType: any;
  public collateralTypes: ICollateralType[];
  constructor(private collateralTypeService: CollateralTypeService, private collateralService: CollateralService) {}

  ngOnInit(): void {
    this.loadCollateralType();
    this.getDataLov();
    console.log('ini disable', this._disabledOpt);
  }

  public changeCollateralType(param: MatSelectChange): void {
    const value: string = param.value;
    if (value === COLLATERAL_TYPE['realestate']) {
      this.lovColcode = [
        ...new Set([
          ...this.lovLand,
          ...this.lovShop,
          ...this.lovFactory,
          ...this.lovHotel,
          ...this.lovKiosk,
          ...this.lovHouse,
          ...this.lovApartment,
        ]),
      ];
    } else if (value === COLLATERAL_TYPE['property']) {
      this.lovColcode = this.lovHeavy;
    } else if (value === COLLATERAL_TYPE['machine']) {
      this.lovColcode = [];
    } else if (value === COLLATERAL_TYPE['vehicle']) {
      this.lovColcode = [];
    }
  }

  private loadCollateralType(): void {
    this.collateralTypeService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.collateralTypes = res.body;
      });
  }
  getDataLov() {
    // this.collateralService.getLovReal().subscribe(res =>{
    //   this.lovReal = res.body;
    //   console.log("ini RealEstate", this.lovReal);
    // })
    this.collateralService.getLovShop().subscribe(res => {
      this.lovShop = res.body;
      console.log('ini shop', this.lovShop);
    });
    this.collateralService.getLovFactory().subscribe(res => {
      this.lovFactory = res.body;
      console.log('ini Factory', this.lovFactory);
    });
    this.collateralService.getLovHotel().subscribe(res => {
      this.lovHotel = res.body;
      console.log('ini Hotel', this.lovHotel);
    });
    this.collateralService.getLovKiosk().subscribe(res => {
      this.lovKiosk = res.body;
      console.log('ini kiosk', this.lovKiosk);
    });
    this.collateralService.getLovHouse().subscribe(res => {
      this.lovHouse = res.body;
      console.log('ini house', this.lovHouse);
    });
    this.collateralService.getLovApartment().subscribe(res => {
      this.lovApartment = res.body;
      console.log('ini apartment', this.lovApartment);
    });
    this.collateralService.getLovSlbc().subscribe(res => {
      this.lovLsbc = res.body;
      console.log('ini slbc', this.lovLsbc);
    });
    this.collateralService.getLovTd().subscribe(res => {
      this.lovTd = res.body;
      console.log('ini TD', this.lovTd);
    });
    this.collateralService.getLovHeavy().subscribe(res => {
      this.lovHeavy = res.body;
      console.log('ini Heavy', this.lovHeavy);
    });
    this.collateralService.getLovLand().subscribe(res => {
      this.lovLand = res.body;
      console.log('ini Land', this.lovLand);
    });
    this.collateralService.getLovSecured().subscribe(res => {
      this.lovSecured = res.body;
      this.getDataType();
      // this.lovColcode = [...new Set([...this.lovLand, ...this.lovShop, ...this.lovFactory, ...this.lovHotel, ...this.lovKiosk, ...this.lovHouse, ...this.lovApartment, ...this.lovLsbc, ...this.lovTd, ...this.lovHeavy, ...this.lovSecured])];
      console.log('ini unsecured', this.lovSecured);
      // console.log("ini colcode", this.lovColcode);
    });
  }

  getDataType() {
    if (this.collateral.collateralTypeId === 'REALESTATE') {
      this.lovColcode = [
        ...new Set([
          ...this.lovLand,
          ...this.lovShop,
          ...this.lovFactory,
          ...this.lovHotel,
          ...this.lovKiosk,
          ...this.lovHouse,
          ...this.lovApartment,
        ]),
      ];
      console.log('ini collateral id', this.collateral.collateralTypeId);
    } else if (this.collateral.collateralTypeId === 'PROPERTY') {
      this.lovColcode = this.lovHeavy;
    } else if (this.collateral.collateralTypeId === 'MACHINE') {
      this.lovColcode = [];
    } else if (this.collateral.collateralTypeId === 'VEHICLE') {
      this.lovColcode = [];
    }
  }

  valChange(event) {
    switch (event.value) {
      case 'AN020101':
        this.colProposeVal = 'Land';
        break;
      case 'AN02010202':
        this.colProposeVal = 'Factory & Warehouse';
        break;
      case 'AN02010204':
        this.colProposeVal = 'Hotel, School, Mal, Hospital';
        break;
      case 'AN02010301':
        this.colProposeVal = 'House';
        break;
      case 'AN02010302':
        this.colProposeVal = 'Apartment';
        break;
      case 'F4205':
        this.colProposeVal = 'SBLC';
        break;
      case 'F0401':
        this.colProposeVal = 'TD';
        break;
      case 'F0402':
        this.colProposeVal = 'TD';
        break;
      case 'F0403':
        this.colProposeVal = 'TD';
        break;
      case 'F0404':
        this.colProposeVal = 'TD';
        break;
      case 'F040501':
        this.colProposeVal = 'TD';
        break;
      case 'F040502':
        this.colProposeVal = 'TD';
        break;
      case 'F041401':
        this.colProposeVal = 'TD';
        break;
      case 'F041402':
        this.colProposeVal = 'TD';
        break;
      case 'F041403':
        this.colProposeVal = 'TD';
        break;
      case 'F04150102':
        this.colProposeVal = 'TD';
        break;
      case 'F04150103':
        this.colProposeVal = 'TD';
        break;
      case 'F04150106':
        this.colProposeVal = 'TD';
        break;
      case 'F04150201':
        this.colProposeVal = 'TD';
        break;
      case 'F04150204':
        this.colProposeVal = 'TD';
        break;
      case 'F04150205':
        this.colProposeVal = 'TD';
        break;
      case 'F04150299':
        this.colProposeVal = 'TD';
        break;
      case 'F09':
        this.colProposeVal = 'TD';
        break;
      case 'F10':
        this.colProposeVal = 'TD';
        break;
      case 'F11':
        this.colProposeVal = 'TD';
        break;
      case 'F15':
        this.colProposeVal = 'TD';
        break;
      case 'F2001':
        this.colProposeVal = 'TD';
        break;
      case 'F2099':
        this.colProposeVal = 'TD';
        break;
      case 'AN020202':
        this.colProposeVal = 'Heavy equipment/Vehicle';
        break;
      case 'AN020203':
        this.colProposeVal = 'Heavy equipment/Vehicle';
        break;
      case 'AN020299':
        this.colProposeVal = 'Heavy equipment/Vehicle';
        break;
      case 'AN0205':
        this.colProposeVal = 'Heavy equipment/Vehicle';
        break;
      case 'AN0206':
        this.colProposeVal = 'Heavy equipment/Vehicle';
        break;
      case 'AN0299':
        this.colProposeVal = 'Unsecured';
        break;
      case 'AN999901':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F0418':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F0419':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F0420':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F0499':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F4101':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F4102':
        this.colProposeVal = 'Unsecured';
        break;
      case 'F42':
        this.colProposeVal = 'Unsecured';
        break;
      case 'AN02010201':
        this.colProposeVal = 'Shophouse & Office Space';
        break;
      case 'AN02010203':
        this.colProposeVal = 'Shophouse & Office Space';
        break;
      case 'AN02010299':
        this.colProposeVal = 'Kiosk';
        break;
      default:
        this.colProposeVal = '';
    }
  }
  print() {
    console.log('ini collateral', this.collateral);
  }
}
