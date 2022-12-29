import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { IndustryLimit, IIndustryLimit } from './industry-limit.model';
import { ApplicationOptionService } from 'app/entities/application-option/application-option.service';
import { IndustryLimitExposureParameterService } from 'app/entities/master-parameter/industry-limit-exposure-parameter/industry-limit-exposure-parameter.service';
import { ListOfValueIndustryService } from '../../list-of-value-industry.service';
@Component({
  selector: 'jhi-industry-limit',
  templateUrl: './industry-limit.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class IndustryLimitComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public dateAsOf: string;
  public limitPercentage: number;
  public remainingBalance: number;
  public industryLimitExposure: number;
  public limitNominal: number;
  public purposeAmmount: number;
  public remainingAfterCp: number;
  public status: string;
  public cpFaciity = [];
  public remainingAfterCpMinus: number

  constructor(
    public applicationOptionService: ApplicationOptionService,
    public industryLimitExposureParameterService: IndustryLimitExposureParameterService,
    public listOfValueIndustryService: ListOfValueIndustryService
  ) {
    this.dateAsOf = '';
    this.limitPercentage = 0;
    this.remainingBalance = 0;
    this.industryLimitExposure = 0;
    this.limitNominal = 0;
    this.purposeAmmount = 0;
    this.status = '';
  }

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(item: ICreditProposal) {
    for (let i = 0; i < item.products.length; i++) {
      this.cpFaciity.push(item.products[i].attributes.totalPlafond);
    }

    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.applicationOption();
    this.industryLimit();
   
  
    this.purposeAmmount = this.creditProposal.attributes['facilityDetail'].totalPlafond
 
  }


  public fungsiSumOS() {
    let result: number;
    let dolar: number;
    // limit = 0;
    result = 0;
    dolar = 0;

    const dataFilter = this.creditProposal.products.filter(
      obj => obj.attributes['subLimit'] === 'false' || obj.attributes['subLimit'] === false
    );

    if (dataFilter.length > 0) {
      const filterUsd = dataFilter.filter(obj => obj.attributes.currency === 'USD');
      const filterIdr = dataFilter.filter(obj => obj.attributes.currency !== 'USD');
      if (filterIdr.length > 0) {
        for (let i = 0; i < filterIdr.length; i++) {
          if (filterIdr[i].attributes.outstanding !== undefined) {
            // console.log("rupiah", filterIdr[i].attributes.initialLimit);
            result = result + Number(filterIdr[i].attributes.outstanding);
          }
        }
      }
      if (filterUsd.length > 0) {
        for (let i = 0; i < filterUsd.length; i++) {
          if (filterUsd[i].attributes.outstanding !== undefined) {
            // console.log("dolar", filterUsd[i].attributes.outstanding);
            // console.log("kurs ", filterUsd[i].attributes.kurs);
            dolar = dolar + Number(filterUsd[i].attributes.outstanding) * Number(filterUsd[i].attributes.kurs);
          }
        }
      }
    }
    return result + dolar;
  }

  public applicationOption() {
    this.applicationOptionService.query().subscribe((res: any) => {
      for (let i = 0; i < res.body.length; i++) {
        if (res.body[i].id === 'EQUITY_POSITION_AS_DATE_OF') {
          this.dateAsOf = res.body[i].value;
        }
      }
    });
  }


  public industryLimit() {
    this.listOfValueIndustryService.query().subscribe((response: any) => {
      // this.listOfIndustry = res.body;

      for (let i = 0; i < response.body.length; i++) {
        if (response.body[i].label === this.creditProposal.attributes['purposePricing'].industry) {
          this.industryLimitExposureParameterService.find('industry/' + response.body[i].id).subscribe((res: any) => {
            this.limitPercentage = res.body.limitPercentage;
            this.remainingBalance = res.body.remainingBalance;
            this.industryLimitExposure = res.body.industryLimitExposure
            this.limitNominal =  Number(res.body.limitPercentage) * Number(res.body.industryLimitExposure);

            this.totalAmmountFunc(res.body.remainingBalance);
          });
        }
      }
    });
  }

   public totalAmmountFunc(remaining: number) {
    const creditLimit = this.cpFaciity.reduce((a: any, b: any) => Number(a) + Number(b));


    this.remainingAfterCp = Number(remaining) - Number(this.creditProposal.attributes['facilityDetail'].totalPlafond);
    this.remainingAfterCpMinus = Number(this.creditProposal.attributes['facilityDetail'].totalPlafond) - Number(remaining);
   
    if (this.remainingAfterCp > 0) {
      this.status = 'Comply';
    } else {
      this.status = 'Breach The Limit';
    }
  }
}


