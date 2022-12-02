import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPerson } from 'app/entities/person/person.model';

import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { CATEGORY_DEBTOR, COLLECTABILITY_STATUS, RELATION_WITH_HANA, UMKM_CLASSIFICATION } from 'app/shared/constants/base.constants';
import { IDebtorData } from '../../debtor-data/debtor-data.model';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-party-cif-customer-info-debtor-data',
  templateUrl: './party-cif-customer-info-debtor-data.component.html',
  styleUrls: ['../party-cif.style.scss'],
})
export class PartyCifCustomerInfoDebtorDataComponent extends AbstractEntityViewPageComponent<IDebtorData> implements OnInit {
  public categoryDebtor: any;
  public umkmClassification: any;
  private _debtorData: IDebtorData;

  public separate: string;
  @Input() customerType: string;
  @Input()
  get debtorData() {
    return this._debtorData;
  }

  set debtorData(data: IDebtorData) {
    this._debtorData = data;
  }
  public callReportCategoryData = ['Green', 'Yellow (Early Warning)', 'Red (Watch List)'];
  public ifcRiskCategoryData = ['Low', 'Medium', 'High'];
  public relationWithClient: any;
  public collectabilityStatus: any;
  public lineOfBussines: any;
  constructor(protected activatedRoute: ActivatedRoute, protected partyCifService: PartyCifService) {
    super();
    this.relationWithClient = RELATION_WITH_HANA;
    this.collectabilityStatus = COLLECTABILITY_STATUS;
    this.categoryDebtor = CATEGORY_DEBTOR;
    this.umkmClassification = UMKM_CLASSIFICATION;
  }
  ngOnInit(): void {
    this.test();
    this.getDate();
    this.getExis();
    this.CollectabilityStatus();

  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  public test() {
    if (this.debtorData.separateAssetAggrement === true && this.debtorData.separateAssetAggrement !== undefined) {
      this.separate = 'Yes';
    } else if (this.debtorData.separateAssetAggrement === false && this.debtorData.separateAssetAggrement !== undefined) {
      this.separate = 'No';
    } else {
      this.separate = '';
    }
  }

  public CollectabilityStatus() {
    if (this.debtorData.collectabilityStatus === ' ') {
      this.collectabilityStatus = '1';
    }
  }

  public year: any;
  getDate() {
    this.year = new Date(this.debtorData.occupiedSince);
    const fullYear = this.year.getFullYear();
    this.debtorData.occupiedSince = fullYear;
  }

  getExis() {
    this.year = new Date(this.debtorData.customerSince);
    const fullYear = this.year.toISOString().split('T')[0];
    this.debtorData.customerSince = fullYear;
  }
}
