import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { GEO_BOUNDARY_TYPE } from 'app/shared/constants/base.constants';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { FormControl } from '@angular/forms';
import { IOrganizationManagement } from 'app/entities/organization-management/organization-management.model';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { Observable, startWith, map } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'jhi-collateral-owner-address',
  templateUrl: './collateral-owner-address.component.html',
  styleUrls: ['./collateral-owner-address.style.scss'],
})
export class CollateralOwnerAddressComponent implements OnInit {
  private _postalAddress: IPostalAddress;
  public parentPath = this.router.url.split('/')[1];
  public activeRoute: string;
  @Input()
  public disabled: Boolean = false;
  identityId: string;
  adress: IPostalAddress;
  public country: string;
  public province: string;
  public cities: string;
  public districts: string;
  public villages: string;
  dobPerson: Date;
  pobPerson: string;
  hidden: boolean;
  guarantorName: string;

  private _partyCif: IPartyCif;
  adress1: string;
  city: string;
  kodePos: string;
  lbuCode: string;
  @Input()
  get partyCif() {
    return this._partyCif;
  }
  set partyCif(data: IPartyCif) {
    this._partyCif = data;
  }
  @Input()
  get postalAddress(): IPostalAddress {
    return this._postalAddress;
  }
  set postalAddress(param: IPostalAddress) {
    this._postalAddress = param;
  }

  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(item: ICollateral) {
    this._collateral = item;
  }
  constructor(
    protected partyCifService: PartyCifService,
    protected activatedRoute: ActivatedRoute,
    private stateBoundaryService: StateBoundaryService,
    protected router: Router
  ) {}
  public findCif() {
    if (this.collateral.collateralOwnerCif !== null) {
      this.partyCifService.findCifCash(this.collateral.collateralOwnerCif).subscribe(res => {
        this.partyCif = res.body;
        if (this.partyCif) {
          this.lbuCode = this.partyCif.debtorData.gnrlBankReportCode;
          this.guarantorName = this.partyCif.name;
          if (this.partyCif.customerType === 'PERSONAL') {
            this.identityId = this.partyCif.customerPerson.personalIdNumber;
            this.dobPerson = this.partyCif.customerPerson.dob;
            this.pobPerson = this.partyCif.customerPerson.pob;
          } else if (this.partyCif.customerType === 'CORPORATE') {
            this.identityId = this.partyCif.customerOrganization.organizationIdNumber;
          }
          const adress = this.partyCif.addresses.find(obj => obj.purposeTypeId === 'PRIMARY_LOCATION');
          this.adress1 = adress.address.address1;
          this.country = adress.address.countryName;
          this.province = adress.address.provinceName;
          this.city = adress.address.cityName;
          this.districts = adress.address.districtName;
          this.villages = adress.address.villageName;
          this.kodePos = adress.address.postalCode;
        }
      });
    }
  }

  public countAge(): number {
    let age: number;
    age = 0;
    if (this.dobPerson) {
      age = moment().diff(moment(this.dobPerson), 'year');
    }
    return age;
  }
  ngOnInit(): void {
    console.log(this.partyCif, 'cif');
    this.findCif();
  }
  public dataSource() {
    if (this.collateral?.dataSource === 'h' || this.collateral?.dataSource === 'H') {
      return true;
    }
    return false;
  }
}
