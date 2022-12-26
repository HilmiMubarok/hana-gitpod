import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { PURPOSE_TYPE } from 'app/shared/constants/base.constants';
import { map, Observable, startWith } from 'rxjs';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address-warehouse',
  templateUrl: './party-cif-customer-info-postal-address-warehouse.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressWarehouseComponent
  extends AbstractEntityViewPageComponent<IPartyPostalAddress>
  implements OnInit, OnChanges
{
  // country
  myControlCountry = new FormControl('');
  public optionsCountry: IStateBoundary[];
  public filteredOptionsCountry: Observable<IStateBoundary[]>;

  // province
  public filteredOptionsProvince: Observable<IStateBoundary[]>;
  myControlProvince = new FormControl('');
  public optionsProvince: IStateBoundary[];

  // city
  myControlCity = new FormControl('');
  public optionsCity: IStateBoundary[];
  public filteredOptionsCity: Observable<IStateBoundary[]>;

  // district
  myControlDistrict = new FormControl('');
  public optionsDistrict: IStateBoundary[];
  public filteredOptionsDistrict: Observable<IStateBoundary[]>;

  // village
  myControlVillage = new FormControl('');
  public optionsVillage: IStateBoundary[];
  public filteredOptionsVillage: Observable<IStateBoundary[]>;

  private _addresses: IPartyPostalAddress[];
  private _partyCif: IPartyCif;
  public purposeTypes: IPurposeType[];
  public _warehouseAddress: IPartyPostalAddress;
  public _domicileAddress: IPartyPostalAddress;

  private _partyPostalAddresses = new PartyPostalAddress();

  public postalAdress: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;

  public country: IStateBoundary;
  public province: IStateBoundary;
  public cities: IStateBoundary;
  public districts: IStateBoundary;
  public villages: IStateBoundary;

  // public country: IStateBoundary[];
  // public provinces: IStateBoundary[];
  // public districts: IStateBoundary[];
  // public villages: IStateBoundary[];
  // public cities: IStateBoundary[];

  public wareHouseLocation: IPartyPostalAddress;
  public index: number;
  public purposeType: string;
  public address1: string;

  public initCountry: number;
  public initProvince: number;
  public initCity: number;
  public initDistrict: number;
  public initVillage: number;

  @Input() isWarehouse: Boolean = false;
  @Input()
  public disabled: Boolean = false;

  @Input()
  get partyPostalAddress() {
    return this._partyPostalAddresses;
  }

  set partyPostalAddress(data: IPartyPostalAddress) {
    console.log('datasss', data);
    this._partyPostalAddresses = data;
  }
  @Input()
  get domicileAddress() {
    return this._domicileAddress;
  }

  set domicileAddress(data: IPartyPostalAddress) {
    this._domicileAddress = data;
  }

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    private stateBoundaryService: StateBoundaryService,
    private purposeTypeService: PurposeTypeService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyPostalAddress']) {
      this.prepareView();
      this.searchwareHouse();
    }
  }

  ngOnInit(): void {
    this.cekDataSource();

    this.loadPurposeType();
    this.initializeCountry();

    this.purposeType = this.partyCif.addresses[this.index].purposeTypeId;
    this.address1 = this.partyCif.addresses[this.index].address.address1;

    this.initCountry = this.partyCif.addresses[this.index].address.countryId;
    this.initProvince = this.partyCif.addresses[this.index].address.provinceId;
    this.initCity = this.partyCif.addresses[this.index].address.cityId;
    this.initDistrict = this.partyCif.addresses[this.index].address.districtId;
    this.initVillage = this.partyCif.addresses[this.index].address.villageId;
  }

  changePurpose() {
    this.partyCif.addresses[this.index].purposeTypeId = this.purposeType;
  }

  addressChange() {
    this.partyCif.addresses[this.index].address.address1 = this.address1;
  }

  public searchwareHouse() {
    this.index = this.partyCif?.addresses.findIndex(obj => obj.purposeTypeId === PURPOSE_TYPE.WAREHOUSE);
    console.log('index ', this.index);
  }

  filteredCountry() {
    this.filteredOptionsCountry = this.myControlCountry.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCountry(name as string) : this.optionsCountry.slice();
      })
    );
  }

  private _filterCountry(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsCountry.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnCounrtry(country: IStateBoundary): string {
    return country && country.description ? country.description : '';
  }

  filteredProvince() {
    this.filteredOptionsProvince = this.myControlProvince.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterProvince(name as string) : this.optionsProvince.slice();
      })
    );
  }

  private _filterProvince(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsProvince.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnProvince(province: IStateBoundary): string {
    return province && province.description ? province.description : '';
  }

  filteredCity() {
    this.filteredOptionsCity = this.myControlCity.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterCity(name as string) : this.optionsCity.slice();
      })
    );
  }

  private _filterCity(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsCity.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnCity(city: IStateBoundary): string {
    return city && city.description ? city.description : '';
  }

  filteredDistrict() {
    this.filteredOptionsDistrict = this.myControlDistrict.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterDistrict(name as string) : this.optionsDistrict.slice();
      })
    );
  }

  private _filterDistrict(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsDistrict.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnDistrict(district: IStateBoundary): string {
    return district && district.description ? district.description : '';
  }

  filteredVillage() {
    this.filteredOptionsVillage = this.myControlVillage.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filtervillage(name as string) : this.optionsVillage.slice();
      })
    );
  }

  private _filtervillage(description: string): IStateBoundary[] {
    const filterValue = description.toLowerCase();
    return this.optionsVillage.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  displayFnVillage(village: IStateBoundary): string {
    return village && village.description ? village.description : '';
  }

  private prepareView() {
    if (this.initCountry) {
      this.initializeProvince();
    }
    if (this.initProvince) {
      this.initializeCity();
    }
    if (this.initCity) {
      this.initializeDistrict();
    }
    if (this.initDistrict) {
      this.initializeVillage();
    }
  }

  public initializeCity(): void {
    this.stateBoundaryService
      .queryFilterBy({ size: 999, idBoundaryType: GEO_BOUNDARY_TYPE['city'], idParent: this.partyPostalAddress.address.provinceId })
      .subscribe(res => {
        this.optionsCity = res.body;
        this.filteredCity();
        this.cities = this.optionsCity.find(obj => obj.id === this.initCity);
      });
  }

  public initializeDistrict(): void {
    this.stateBoundaryService
      .queryFilterBy({ size: 999, idBoundaryType: GEO_BOUNDARY_TYPE['district'], idParent: this.partyPostalAddress.address.cityId })
      .subscribe(res => {
        this.optionsDistrict = res.body;
        this.filteredDistrict();
        this.districts = this.optionsDistrict.find(obj => obj.id === this.initDistrict);
      });
  }

  public initializeVillage(): void {
    this.stateBoundaryService
      .queryFilterBy({ size: 999, idBoundaryType: GEO_BOUNDARY_TYPE['village'], idParent: this.partyPostalAddress.address.districtId })
      .subscribe(res => {
        this.optionsVillage = res.body;
        this.filteredVillage();
        this.villages = this.optionsVillage.find(obj => obj.id === this.initVillage);
      });
  }

  public initializeProvince(): void {
    this.stateBoundaryService
      .queryFilterBy({ size: 999, idBoundaryType: GEO_BOUNDARY_TYPE['province'], idParent: this.partyPostalAddress.address.countryId })
      .subscribe(res => {
        this.optionsProvince = res.body;
        this.filteredProvince();
        this.province = this.optionsProvince.find(obj => obj.id === this.initProvince);
      });
  }

  public getIdVillage() {
    this.partyPostalAddress.address.villageId = this.villages?.id;
  }

  public initializeCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        size: 250,
      })
      .subscribe(res => {
        this.optionsCountry = res.body;
        this.filteredCountry();
        this.country = this.optionsCountry.find(obj => obj.id === this.initCountry);
      });
  }

  public getValueCountry() {
    this.partyPostalAddress.address.countryId = this.country?.id;
    this.initializeProvince();
  }

  public getValueProvince() {
    this.partyPostalAddress.address.provinceId = this.province?.id;
    this.initializeCity();
  }

  public getValueCity() {
    this.partyPostalAddress.address.cityId = this.cities?.id;
    this.initializeDistrict();
  }

  public getValueDistrict() {
    this.partyPostalAddress.address.districtId = this.districts?.id;
    this.initializeVillage();
  }

  private loadPurposeType(): void {
    this.purposeTypeService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.purposeTypes = res.body;
      });
  }
  public cekDataSource() {
    if (this.disabled === true) {
      this.myControlCountry.disable();
      this.myControlProvince.disable();
      this.myControlCity.disable();
      this.myControlDistrict.disable();
      this.myControlVillage.disable();
    }

    // private loadCountry(): void {
    //   this.stateBoundaryService
    //     .queryFilterBy({
    //       idBoundaryType: GEO_BOUNDARY_TYPE['country'],
    //       size: 9999,
    //     })
    //     .subscribe(res => {
    //       this.country = res.body;
    //     });
    // }

    // loadProvince(): void {
    //   const idCountry = this.partyPostalAddress.address.countryId;
    //   if (idCountry) {
    //     const predicate: object = {
    //       idBoundaryType: GEO_BOUNDARY_TYPE['province'],
    //       page: 0,
    //       size: 9999,
    //       idParent: idCountry,
    //     };

    //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
    //       this.provinces = res.body;
    //     });
    //   }
    // }

    // loadCity(): void {
    //   const idProvince = this.partyPostalAddress.address.provinceId;
    //   if (idProvince) {
    //     const predicate: object = {
    //       idBoundaryType: GEO_BOUNDARY_TYPE['city'],
    //       size: 9999,
    //       idParent: idProvince,
    //     };
    //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
    //       this.cities = res.body;
    //     });
    //   }
    // }

    // loadDistrict(): void {
    //   const idCity = this.partyPostalAddress.address.cityId;
    //   if (idCity) {
    //     const predicate: object = {
    //       idBoundaryType: GEO_BOUNDARY_TYPE['district'],
    //       size: 9999,
    //       idParent: idCity,
    //     };
    //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
    //       this.districts = res.body;
    //     });
    //   }
    // }

    // loadVillage(): void {
    //   const idDistrict = this.partyPostalAddress.address.districtId;
    //   if (idDistrict) {
    //     const predicate: object = {
    //       idBoundaryType: GEO_BOUNDARY_TYPE['village'],
    //       size: 9999,
    //       idParent: idDistrict,
    //     };
    //     this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
    //       this.villages = res.body;
    //     });
    //   }
    // }

    //
    // public warehouseAddressData() {
    //   if (this.warehouseAddress === 'warehouseAddress') {
    //     return false;
    //   }
    //   return true;
    // }

    // print() {
    //   console.log({
    //     postaladdress: this.addresses,
    //   });
    // }
  }
}
