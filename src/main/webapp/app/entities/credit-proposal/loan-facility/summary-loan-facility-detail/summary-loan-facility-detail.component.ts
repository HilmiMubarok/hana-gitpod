import { Component, Input, OnInit } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterFinancialInstitutionService } from 'app/entities/master-parameter/financial-institution/master-financial-institution.service';
import { BusinessActivityService } from '../../busines-activity/business-activity.service';
import {
  ApplicationProduct,
  ApplicationProductAttribute,
  IApplicationProduct,
} from 'app/entities/application-product/application-product.model';
import { MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { IMasterFinancialInstitution } from 'app/entities/master-parameter/financial-institution/master-financial-institution.model';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'jhi-summary-loan-facility-detail',
  templateUrl: './summary-loan-facility-detail.component.html',
  styleUrls: ['../grid/loan.scss', '../credit-proposal-tab-loan-facility-detail.css'],
})
export class SummaryLoanFacilityDetailComponent {
  public _creditProposal: ICreditProposal;
  public dataFilter = [];

  @Input() isViewLoan: Boolean = false;
  @Input() takeOutCompare: Boolean = false;

  public resourceUrl: string;

  @Input() parentSource: String = '';

  @Input() parentSourceSub: String = '';

  @Input() isViewMode: Boolean = false;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public applicationProduct: IApplicationProduct;
  public newMessage: string;
  public ccy: string;

  public customHeadersJWT: any;

  constructor(
    protected actRoute: ActivatedRoute,
    private masterFinancialInstitutionService: MasterFinancialInstitutionService,
    private baService: BusinessActivityService,
    protected messageService: MessageService,
    protected activatedRoute: ActivatedRoute
  ) {
    this.applicationProduct = new ApplicationProduct();
    this.applicationProduct.attributes = new ApplicationProductAttribute();
    this.loadFinancialInstitution();
  }

  // setCurrency
  setCurrency() {
    this.ccy = this.creditProposal.products[0].currencyId;
  }

  // kebutuhan untuk auto complete previous bank
  private loadFinancialInstitution(): void {
    this.masterFinancialInstitutionService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataMasterFinancialInstitution = res.body;
        this.filteredMVOri();
        this.MVOriCcy = this.dataMasterFinancialInstitution.find(
          obj => obj.code === this.creditProposal.attributes['facilityDetail'].previousBank
        );
      });
  }

  public myControlMVOri = new FormControl();
  public dataMasterFinancialInstitution: IMasterFinancialInstitution[];
  public filteredOptionsMVOri: Observable<IMasterFinancialInstitution[]>;
  public MVOriCcy: IMasterFinancialInstitution;

  filteredMVOri() {
    this.filteredOptionsMVOri = this.myControlMVOri.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.description;
        return name ? this._filterMVOri(name as string) : this.dataMasterFinancialInstitution.slice();
      })
    );
  }

  displayFnMVOri(item: IMasterFinancialInstitution): string {
    return item && item.description ? item.description : '';
  }

  private _filterMVOri(description: string): IMasterFinancialInstitution[] {
    const filterValue = description.toLowerCase();
    return this.dataMasterFinancialInstitution.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  getDataBank() {
    this.creditProposal.attributes['facilityDetail'].previousBank = this.MVOriCcy.code;
  }

  getDataBankView() {
    if (this.MVOriCcy) {
      return this.MVOriCcy.description;
    }
    return this.creditProposal.attributes['facilityDetail'].previousBank;
  }
}
