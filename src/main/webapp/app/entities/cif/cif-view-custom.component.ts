import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { IPartyGroup } from '../party-group/party-group.model';
import { IPerson, Person } from '../person/person.model';
import { IPostalAddress } from '../postal-address/postal-address.model';

@Component({
  selector: 'jhi-cif-view-custom',
  templateUrl: './cif-view-custom.component.html',
  styleUrls: ['./css/cif.css'],
})
export class CifViewCustomComponent implements OnChanges, OnInit {
  public spouseViewMode: string;
  public personModel: IPerson = new Person();

  public _spouse: IPerson;
  public _primaryAddress: IPostalAddress;
  public _previousAddress: IPostalAddress;
  public _prospectPerson: IPerson;
  public _prospectOrganization: IPartyGroup;
  public _selectedPartyType: string;

  @Input()
  get selectedPartyType() {
    return this._selectedPartyType;
  }
  set selectedPartyType(item: string) {
    this._selectedPartyType = item;
  }

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

  constructor() {}
  ngOnInit(): void {
    this.spouseViewMode = 'view';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prospectPerson']) {
      if (this.prospectPerson.maritalStatus.toLowerCase() === 'kawin') {
        this.spouseViewMode = 'edit';
      }
    }
  }

  public updateMaritalStatus(maritalStatus: IOptionNode): void {
    if (maritalStatus.id.toLowerCase() === 'kawin') {
      this.spouse.maritalStatus = 'kawin'.toUpperCase();
      this.spouseViewMode = 'edit';
    } else {
      this.spouseViewMode = 'view';
    }
  }
}
