import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { ICollateral } from '../collateral/collateral.model';
import { IStateBoundary } from '../state-boundary/state-boundary.model';
import { StateBoundaryService } from '../state-boundary/state-boundary.service';
import { IPostalAddress } from './postal-address.model';

@Component({
  selector: 'jhi-postal-address-view-custom',
  templateUrl: './postal-address-view-custom.component.html',
})
export class PostalAddressViewCustomComponent implements OnInit, OnChanges {
  private _postalAddress: IPostalAddress;

  @Input()
  get postalAddress(): IPostalAddress {
    return this._postalAddress;
  }
  set postalAddress(param: IPostalAddress) {
    this._postalAddress = param;
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }

  private _collateral: ICollateral;
  public country: IStateBoundary[] = [];
  public province: IStateBoundary[] = [];
  public cities: IStateBoundary[] = [];
  public districts: IStateBoundary[] = [];
  public villages: IStateBoundary[] = [];

  constructor(private stateBoundaryService: StateBoundaryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postalAddress']) {
      this.prepareView();
    }
  }

  ngOnInit(): void {
    this.initializeCountry();
  }

  private prepareView() {
    if (this.postalAddress.countryId) {
      this.initializeProvince(this.postalAddress.countryId);
    }
    if (this.postalAddress.provinceId) {
      this.initializeCity(this.postalAddress.provinceId);
    }
    if (this.postalAddress.cityId) {
      this.initializeDistrict(this.postalAddress.cityId);
    }

    if (this.postalAddress.villageId) {
      this.initializeVillage(this.postalAddress.villageId);
    }
  }

  private initializeCity(parentId: Number): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'], idParent: parentId }).subscribe(res => {
      this.cities = res.body;
    });
  }

  private initializeDistrict(parentId: Number): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['district'], idParent: parentId }).subscribe(res => {
      this.districts = res.body;
    });
  }

  private initializeVillage(parentId: Number): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'], idParent: parentId }).subscribe(res => {
      this.villages = res.body;
    });
  }

  private initializeProvince(parentId: Number): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['province'], idParent: parentId }).subscribe(res => {
      this.province = res.body;
    });
  }

  private initializeCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        size: 250,
      })
      .subscribe(res => {
        this.country = res.body;
      });
  }

  selectCountry(args: any) {
    const val: number = args['value'];
    this.postalAddress.countryId = val;
    this.initializeProvince(val);
  }

  selectProvince(args: any) {
    const val: number = args['value'];
    this.postalAddress.provinceId = val;
    this.initializeCity(val);
  }

  selectCity(args: any) {
    const val: number = args['value'];
    this.postalAddress.cityId = val;
    this.initializeDistrict(val);
  }

  selectDistrict(args: any) {
    const selectedDistrict: IStateBoundary = args['itemData'];
    this.postalAddress.districtId = selectedDistrict.id;
  }

  selectVillage(args: any) {
    const val: number = args['value'];
    this.postalAddress.villageId = val;
    this.initializeVillage(val);
  }

  public dataSource() {
    if (this.collateral?.dataSource === 'h' || this.collateral?.dataSource === 'H') {
      return true;
    }
    return false;
  }
}
