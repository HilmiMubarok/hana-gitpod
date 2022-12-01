import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { IndustryLimit, IIndustryLimit } from './industry-limit.model';
import { ApplicationOptionService } from 'app/entities/application-option/application-option.service';
import { IndustryLimitExposureParameterService } from 'app/entities/master-parameter/industry-limit-exposure-parameter/industry-limit-exposure-parameter.service';

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

  constructor(
    public applicationOptionService: ApplicationOptionService,
    public industryLimitExposureParameterService: IndustryLimitExposureParameterService
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
    this.totalAmmountFunc();
  }

  public totalAmmountFunc() {
    const creditLimit = this.cpFaciity.reduce((a: any, b: any) => Number(a) + Number(b));

    this.purposeAmmount = creditLimit;

    this.remainingAfterCp = creditLimit - this.remainingBalance;

    if (this.remainingAfterCp > 0) {
      this.status = 'Comply';
    } else {
      this.status = 'Breach The Limit';
    }
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
    this.industryLimitExposureParameterService
      .find('/industry/' + this.creditProposal.attributes['purposePricing'].industry)
      .subscribe((res: any) => {
        this.limitPercentage = res.body.limitPercentage;
        this.remainingBalance = res.body.remainingBalance;
        this.industryLimitExposure = res.body.industryLimitExposure;
        this.limitNominal = res.body.limitNominal;
      });
  }
}
