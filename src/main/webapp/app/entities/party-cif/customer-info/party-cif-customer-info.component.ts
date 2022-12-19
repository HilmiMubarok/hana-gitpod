import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IPartyPostalAddressWarehouse,
  PartyPostalAddressWarehouse,
} from 'app/entities/party-postal-address/party-postal-address-warehouse.model';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { PartyPostalAddressService } from 'app/entities/party-postal-address/party-postal-address.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { PURPOSE_TYPE } from 'app/shared/constants/base.constants';
import lodash from 'lodash';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info',
  templateUrl: './party-cif-customer-info.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoComponent implements OnChanges {
  private _partyCIf: IPartyCif;

  public domicileLocation: IPartyPostalAddress;
  public primaryLocation: IPartyPostalAddress;
  public warehouseLocation: IPartyPostalAddressWarehouse;
  public purposeTypes: IPurposeType[];

  @Input()
  get partyCif() {
    return this._partyCIf;
  }

  set partyCif(data: IPartyCif) {
    this._partyCIf = data;
  }

  constructor(protected activatedRoute: ActivatedRoute) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif']) {
      this.splitPostalAddress(this.partyCif.addresses);
    }
  }

  private splitPostalAddress(param: IPartyPostalAddress[]): void {
    if (param.length > 0) {
      this.primaryLocation =
        lodash.find(param, function (o) {
          return o.purposeTypeId === PURPOSE_TYPE.PRIMARY.toString();
        }) || new PartyPostalAddress();
      this.domicileLocation =
        lodash.find(param, function (o) {
          return o.purposeTypeId === PURPOSE_TYPE.DOMICILE.toString();
        }) || new PartyPostalAddress();
      // this.warehouseLocation =
      //   lodash.find(param, function (o) {
      //     return o.purposeTypeId === PURPOSE_TYPE.WAREHOUSE;
      //   }) || new PartyPostalAddress();
      this.warehouseLocation = this.partyCif.addresses.find(obj => obj.purposeTypeId === PURPOSE_TYPE.WAREHOUSE);
      if (this.warehouseLocation === undefined) {
        this.warehouseLocation = new PartyPostalAddressWarehouse();
        this.warehouseLocation.purposeTypeId = PURPOSE_TYPE.WAREHOUSE;
        this.partyCif.addresses.push(this.warehouseLocation);
      }
    }
  }
}
