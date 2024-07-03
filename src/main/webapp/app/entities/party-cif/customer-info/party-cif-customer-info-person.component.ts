import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { BLOOD_TYPE, GENDER, MARITAL_STATUS } from 'app/shared/constants/base.constants';
import { IPerson } from '../../person/person.model';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { FormBuilder, FormControl } from '@angular/forms';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { IOrganizationManagement } from 'app/entities/organization-management/organization-management.model';
import { formatDateDob } from 'app/shared/helper/utils';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};

@Component({
  selector: 'jhi-party-cif-customer-info-person',
  templateUrl: './party-cif-customer-info-person.component.html',
  styleUrls: ['../party-cif.style.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PartyCifCustomerInfoPersonComponent extends AbstractEntityViewPageComponent<IPerson> implements OnInit {
  private _person: IPerson;
  private _organization: IOrganizationManagement;
  private _spouse: string;
  private _debtorData: IDebtorData;
  private staticDob: any;

  moment = _rollupMoment || _moment;

  date = new FormControl(moment());

  @Input()
  get person() {
    return this._person;
  }

  set person(data: IPerson) {
    this._person = data;
  }

  @Input()
  get organization() {
    return this._organization;
  }

  set organization(data: IOrganizationManagement) {
    this._organization = data;
  }

  @Input()
  get debtorData() {
    return this._debtorData;
  }

  set debtorData(data: IDebtorData) {
    this._debtorData = data;
  }
  @Input()
  get spouse() {
    return this._spouse;
  }

  set spouse(data: string) {
    this._spouse = data;
  }

  public bloodTypes: any;
  public maritalStatuses: any;
  public genders: any;
  public dataHidden: string;
  constructor(protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {
    super();
    this.bloodTypes = BLOOD_TYPE;
    this.maritalStatuses = MARITAL_STATUS;
    this.genders = GENDER;
  }

  ngOnInit(): void {
    this.convrtDate();
  }
  public countAge(): number {
    let age: number;
    age = 0;
    if (this.person.dob) {
      age = moment().diff(moment(this.person.dob), 'year');
    }
    return age;
  }
  public spouseData() {
    if (this.spouse === 'spouse') {
      return false;
    }
    return true;
  }
  public spouseCustomer() {
    if (this.spouse === 'spouse') {
      return true;
    }
    return false;
  }

  public convrtDate() {
    const fullYear = new Date(this.person.dob);
    const year = fullYear.toISOString().split('T')[0];

    this.staticDob = formatDateDob(this.person.dob);
  }

  private getStaticDate(date: any) {
    const dobDate = new Date(date);
    const year = dobDate.getFullYear();
    const month = (dobDate.getMonth() + 1).toString().padStart(2, '0');
    const day = dobDate.getDate().toString().padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  public dataSource() {
    if (this.organization.dataSource === 'h' || this.organization.dataSource === 'H') {
      return true;
    }
    return false;
  }

  public conditionCompleteNameSpouse() {
    if (
      (this.person.firstName === null && this.person.lastName === '') ||
      (this.person.lastName === null && this.person.firstName === '') ||
      (this.person.firstName === null && this.person.lastName === null) ||
      (this.person.firstName === '' && this.person.lastName === '')
    ) {
      return 'NA';
    } else if (this.person.firstName === null || this.person.firstName === '') {
      return this.person.lastName;
    } else if (this.person.lastName === '' || this.person.lastName === null) {
      return this.person.firstName;
    } else {
      return this.person.firstName + ' ' + this.person.lastName;
    }
  }
}
