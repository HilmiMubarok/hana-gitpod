import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { IStateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';

@Component({
  selector: 'jhi-party-cif-customer-info-postal-address',
  templateUrl: './party-cif-customer-info-postal-address.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPostalAddressComponent extends AbstractEntityViewPageComponent<IPartyPostalAddress> implements OnInit {
  public country: IStateBoundary[];
  public provinces: IStateBoundary[];
  public districts: IStateBoundary[];
  public villages: IStateBoundary[];
  public cities: IStateBoundary[];
  public purposeTypes: IPurposeType[];
  public _domicileAddress: string;

  private _partyPostalAddresses = new PartyPostalAddress();

  public postalAdress: IPartyPostalAddress;
  public generalLocation: IPartyPostalAddress;

  @Input()
  get partyPostalAddresses() {
    return this._partyPostalAddresses;
  }

  set partyPostalAddresses(data: IPartyPostalAddress) {
    this._partyPostalAddresses = data;
  }
  @Input()
  get domicileAddress() {
    return this._domicileAddress;
  }

  set domicileAddress(data: string) {
    this._domicileAddress = data;
  }

  constructor(
    protected activatedRoute: ActivatedRoute,
    private stateBoundaryService: StateBoundaryService,
    private purposeTypeService: PurposeTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPurposeType();
    this.loadCountry();
    this.initializeProvince();
    this.initializeCity();
    this.initializeDistrict();
    this.initializeVillage();
  }

  private loadPurposeType(): void {
    this.purposeTypeService.query({ page: 0, size: 9999 }).subscribe(res => {
      this.purposeTypes = res.body;
    });
  }

  private loadCountry(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['country'] }).subscribe(res => {
      this.country = res.body;
    });
  }

  private initializeProvince(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['province'] }).subscribe(res => {
      this.provinces = res.body;
    });
  }

  private initializeCity(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'] }).subscribe(res => {
      this.cities = res.body;
    });
  }

  private initializeDistrict(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['district'] }).subscribe(res => {
      this.districts = res.body;
    });
  }

  private initializeVillage(): void {
    this.stateBoundaryService.queryFilterBy({ idBoundaryType: GEO_BOUNDARY_TYPE['city'] }).subscribe(res => {
      this.villages = res.body;
    });
  }
  public domicileAddressData() {
    if (this.domicileAddress === 'domicileAddress') {
      return false;
    }
    return true;
  }
}
