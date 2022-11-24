import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPartyPostalAddress, PartyPostalAddress } from 'app/entities/party-postal-address/party-postal-address.model';
import { PartyPostalAddressService } from 'app/entities/party-postal-address/party-postal-address.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { IPurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import lodash from 'lodash';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-customer-info',
  templateUrl: './party-cif-customer-info.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoComponent implements OnChanges {
  private _partyCIf: IPartyCif;

  // public postalAddress: IPostalAddress;

  public postalAdress = new PartyPostalAddress();
  public generalLocation = new PartyPostalAddress();
  public domisiliLocattion = new PartyPostalAddress();

  public warehouseLocation = new PartyPostalAddress();

  public domicileAddress: IPartyPostalAddress[];
  public generalAddress: IPartyPostalAddress[];
  public warehouseAddress: IPartyPostalAddress[];
  public purposeTypes: IPurposeType[];

  // public postalAdress:any

  @Input()
  get partyCif() {
    return this._partyCIf;
  }

  set partyCif(data: IPartyCif) {
    this._partyCIf = data;
  }

  constructor(protected activatedRoute: ActivatedRoute, private purposeTypeService: PurposeTypeService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyCif']) {
      this.splitPostalAddress(this.partyCif.addresses);
    }
  }

  private splitPostalAddress(param: IPartyPostalAddress[]): void {
    if (param.length > 0) {
      this.generalAddress = [];
      this.domicileAddress = [];
      this.warehouseAddress = [];

      this.generalLocation = param.find(obj => obj.purposeTypeId === 'PRIMARY_LOCATION');
      this.domisiliLocattion = param.find(obj => obj.purposeTypeId === 'DOMICILE_LOCATION');
      this.warehouseLocation = param.find(obj => obj.purposeTypeId === 'WAREHOUSE_LOCATION');

      if (this.generalLocation) {
        this.generalAddress.push(this.generalLocation);
      } else {
        this.generalLocation = new PartyPostalAddress();
        this.generalAddress.push(this.generalLocation);
      }

      if (this.domisiliLocattion) {
        this.domicileAddress.push(this.domisiliLocattion);
      } else {
        this.domisiliLocattion = new PartyPostalAddress();
        this.domicileAddress.push(this.domisiliLocattion);
      }

      if (this.warehouseLocation) {
        this.warehouseAddress.push(this.warehouseLocation);
      } else {
        this.warehouseLocation = new PartyPostalAddress();
        this.warehouseAddress.push(this.warehouseLocation);
      }
    }
  }
}
