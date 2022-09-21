import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { BLOOD_TYPE, GENDER, MARITAL_STATUS } from 'app/shared/constants/base.constants';
import { IPerson } from '../../person/person.model';
import moment from 'moment';

@Component({
  selector: 'jhi-party-cif-customer-info-person',
  templateUrl: './party-cif-customer-info-person.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoPersonComponent extends AbstractEntityViewPageComponent<IPerson> {
  private _person: IPerson;

  @Input()
  get person() {
    return this._person;
  }

  set person(data: IPerson) {
    this._person = data;
  }

  public bloodTypes: any;
  public maritalStatuses: any;
  public genders: any;
  constructor(protected activatedRoute: ActivatedRoute) {
    super();
    this.bloodTypes = BLOOD_TYPE;
    this.maritalStatuses = MARITAL_STATUS;
    this.genders = GENDER;
  }

  public countAge(): number {
    let age: number;
    age = 0;
    if (this.person.dob) {
      age = moment().diff(moment(this.person.dob), 'year');
    }
    return age;
  }
}
