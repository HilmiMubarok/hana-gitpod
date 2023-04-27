import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address',
  templateUrl: './party-cif-customer-info-postal-address.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressComponent extends AbstractEntityViewPageComponent<IPartyPostalAddress> {
  public country: IStateBoundary[];
  public provinces: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  public cities: IStateBoundary[];

  private _partyPostalAddresses = new PartyPostalAddress();

  @Input()
  public disabled: Boolean = false;

  @Input()
  get partyPostalAddress() {
    return this._partyPostalAddresses;
  }

  set partyPostalAddress(data: IPartyPostalAddress) {
    this._partyPostalAddresses = data;

    this.loadCountry();
    this.loadProvince(this._partyPostalAddresses.address.countryId);
    this.loadCity(this._partyPostalAddresses.address.provinceId);
    this.loadDistrict(this._partyPostalAddresses.address.cityId);
    this.loadVillage(this._partyPostalAddresses.address.districtId);
  }

  constructor(protected activatedRoute: ActivatedRoute, private stateBoundaryService: StateBoundaryService) {
    super();
    this.country = [];
    this.provinces = [];
    this.cities = [];
    this.districts = [];
    this.villages = [];
  }

  public findStateBoundary(id: number, param: IStateBoundary[]): IStateBoundary {
    if (param.length > 0) {
      for (let i = 0; i < param.length; i++) {
        const item: IStateBoundary = param[i];
        if (item.id === id) {
          return item;
        }
      }
    }
    return new StateBoundary();
  }

  private loadCountry(): void {
    this.stateBoundaryService
      .queryFilterBy({
        idBoundaryType: GEO_BOUNDARY_TYPE['country'],
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.country = res.body;
      });
  }

  public loadProvince(idCountry: number = null): void {
    if (idCountry) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        page: 0,
        size: 9999,
        idParent: idCountry,
      };

      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        console.log('dataaa', res);

        // this.provinces = res.body;
      });
    }

    /* if (idCountry === 199) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        page: 0,
        size: 9999,
        idParent: idCountry,
      };

      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.provinces = res.body;
      });
    } else if (idCountry !== 199) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['province'],
        page: 0,
        size: 9999,
      };

      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        const dataData = res.body;
        this.provinces = dataData.filter(o => o.code === '99');
        // ini untuk sementara
      });
    } */

    // provinces
  }
  public filterCountry(id: number, name: any): any {
    if (name === 'country') {
      const country = this.country.filter(obj => obj.id === id);
      return country.length > 0 ? country[0].description : '';
      // return this.country.filter(obj => obj.id === id)[0].description ;
    } else if (name === 'provinces') {
      const provinces = this.provinces.filter(obj => obj.id === id);
      return provinces.length > 0 ? provinces[0].description : '';
    } else if (name === 'cities') {
      const cities = this.cities.filter(obj => obj.id === id);
      return cities.length > 0 ? cities[0].description : '';
    } else if (name === 'districts') {
      const districts = this.districts.filter(obj => obj.id === id);
      return districts.length > 0 ? districts[0].description : '';
    } else if (name === 'villages') {
      const villages = this.villages.filter(obj => obj.id === id);
      return villages.length > 0 ? villages[0].description : '';
    }
  }

  public loadCity(idProvince: number = null): void {
    if (idProvince) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['city'],
        size: 9999,
        idParent: idProvince,
      };
      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.cities = res.body;
      });
    }
  }

  public loadDistrict(idCity: number = null): void {
    if (idCity) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['district'],
        size: 9999,
        idParent: idCity,
      };
      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.districts = res.body;
      });
    }
  }

  public loadVillage(idDistrict: number = null): void {
    if (idDistrict) {
      const predicate: object = {
        idBoundaryType: GEO_BOUNDARY_TYPE['village'],
        size: 9999,
        idParent: idDistrict,
      };
      this.stateBoundaryService.queryFilterBy(predicate).subscribe(res => {
        this.villages = res.body;
      });
    }
  }
}
