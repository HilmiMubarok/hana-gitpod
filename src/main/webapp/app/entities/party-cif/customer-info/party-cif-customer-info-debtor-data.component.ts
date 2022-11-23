import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AbstractEntityViewPageComponent } from 'app/shared/base/abstract-entity-view-page.component';
import { CATEGORY_DEBTOR, COLLECTABILITY_STATUS, RELATION_WITH_HANA, UMKM_CLASSIFICATION } from 'app/shared/constants/base.constants';
import { IDebtorData } from '../../debtor-data/debtor-data.model';
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

  @Input() customerType: string;
  @Input()
  get debtorData() {
    return this._debtorData;
  }

  set debtorData(data: IDebtorData) {
    this._debtorData = data;
  }

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
    this.listLineOfBussines();
  }

  currencyInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  listLineOfBussines() {
    this.partyCifService.getLineOfBussines().subscribe(res => {
      this.lineOfBussines = res.body;
      this.lineOfBussines.forEach(element => element.label);
    });
  }
}
