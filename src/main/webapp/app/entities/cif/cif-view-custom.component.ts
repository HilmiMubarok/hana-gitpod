import { Component, Input, OnInit } from '@angular/core';
import { IPartyGroup } from '../party-group/party-group.model';
import { IPerson } from '../person/person.model';
import { IPostalAddress } from '../postal-address/postal-address.model';

import { ICif, Cif } from './cif.model';
import { CifService } from './cif.service';
@Component({
  selector: 'jhi-cif-view-custom',
  templateUrl: './cif-view-custom.component.html',
})
export class CifViewCustomComponent implements OnInit {
  public _spouse: IPerson;
  public _primaryAddress: IPostalAddress;
  public _previousAddress: IPostalAddress;
  public _prospectPerson: IPerson;
  public _prospectOrganization: IPartyGroup;

  @Input()
  get prospectPerson() {
    return this._prospectPerson;
  }
  set prospectPerson(item: IPerson) {
    this._prospectPerson = item;
  }

  @Input()
  get prospectOrganization() {
    return this._prospectOrganization;
  }
  set prospectOrganization(item: IPartyGroup) {
    this._prospectOrganization = item;
  }

  @Input()
  get spouse() {
    return this._spouse;
  }
  set spouse(item: IPerson) {
    this._spouse = item;
  }

  @Input()
  get primaryAddress() {
    return this._primaryAddress;
  }
  set primaryAddress(item: IPostalAddress) {
    this._primaryAddress = item;
  }

  @Input()
  get previousAddress() {
    return this._previousAddress;
  }
  set previousAddress(item: IPostalAddress) {
    this._previousAddress = item;
  }

  constructor(private cifService: CifService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
