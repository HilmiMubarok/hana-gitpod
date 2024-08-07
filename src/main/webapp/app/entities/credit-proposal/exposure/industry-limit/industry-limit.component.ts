import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { ApplicationOptionService } from 'app/entities/application-option/application-option.service';
import { IndustryLimitExposureParameterService } from 'app/entities/master-parameter/industry-limit-exposure-parameter/industry-limit-exposure-parameter.service';
import { ListOfValueIndustryService } from '../../list-of-value-industry.service';
import { CreditProposalService } from '../../credit-proposal.service';
@Component({
  selector: 'jhi-industry-limit',
  templateUrl: './industry-limit.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class IndustryLimitComponent implements OnInit, OnChanges {
  public _creditProposal: ICreditProposal;
  public dateAsOf: string;
  public limitPercentage: any;
  public remainingBalance: number;
  public industryLimitExposure: number;
  public limitNominal: number;
  public purposeAmmount: number;
  public remainingAfterCp: number;
  public status: string;
  public cpFaciity = [];
  public remainingAfterCpMinus: number;
  public statusRemaining: boolean;

  constructor(
    public applicationOptionService: ApplicationOptionService,
    public industryLimitExposureParameterService: IndustryLimitExposureParameterService,
    public listOfValueIndustryService: ListOfValueIndustryService,
    public creditProposalService: CreditProposalService
  ) {
    this.dateAsOf = '';
    this.limitPercentage = 0;
    this.remainingBalance = 0;
    this.industryLimitExposure = 0;
    this.limitNominal = 0;
    this.purposeAmmount = 0;
    this.status = '';
    this.remainingAfterCpMinus = 0;
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
    // this.industryLimit();
    this.industry().then(() => {
      this.purposeAmmount = 0;
      this.creditProposalService.totalChanges.subscribe((message: any) => {
        this.purposeAmmount = message;
        this.remainingAfterCp = Number(this.remainingBalance) - Number(this.purposeAmmount);
        this.remainingAfterCpMinus = Math.round(Number(this.purposeAmmount) - Number(this.remainingBalance));
        this.statusRemaining = String(this.remainingAfterCp).includes('-');
        if (this.remainingAfterCp > 0) {
          this.status = 'Comply';
        } else {
          this.status = 'Breach The Limit';
        }
      });
    });

    this.purposeAmmount = this.creditProposal.attributes['facilityDetail'].totalPlafond;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.industry();
    if (this.remainingAfterCp > 0) {
      this.status = 'Comply';
    } else {
      this.status = 'Breach The Limit';
    }
  }

  public industry(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.industryLimitExposureParameterService
        .find('industry/' + this.creditProposal.attributes['purposePricing'].industryCode)
        .subscribe((res: any) => {
          this.limitPercentage = res.body.limitPercentage;
          this.remainingBalance = res.body.remainingBalance;
          this.industryLimitExposure = res.body.industryLimitExposure;
          this.limitNominal = res.body.limitNominal;
          // this.totalAmmountFunc(this.remainingBalance);
          resolve(res);
        });
    });
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
          this.dateAsOf = res.body[i].value.split('T')[0];
        }
      }
    });
  }

  // public industryLimit() {
  //   this.listOfValueIndustryService.query().subscribe((response: any) => {
  //     // this.listOfIndustry = res.body;

  //     for (let i = 0; i < response.body.length; i++) {
  //       if (response.body[i].label === this.creditProposal.attributes['purposePricing'].industryCode) {
  //         this.industryLimitExposureParameterService.find('industryCode').subscribe((res: any) => {
  //           this.limitPercentage = res.body.limitPercentage;
  //           this.remainingBalance = res.body.remainingBalance;
  //           this.industryLimitExposure = res.body.industryLimitExposure;
  //           this.limitNominal = Number(res.body.limitPercentage) * Number(res.body.industryLimitExposure);

  //           // this.totalAmmountFunc(this.remainingBalance);
  //           // console.log('cek data1', this.totalAmmountFunc(res.body.remainingBalance))
  //         });
  //       }
  //     }
  //   });
  // }

  // public totalAmmountFunc(remaining: number) {
  //   const creditLimit = this.cpFaciity.reduce((a: any, b: any) => Number(a) + Number(b));
  //   const total = this.creditProposalService.totalChanges.subscribe((message: any) => {
  //     this.purposeAmmount = message;
  //     this.remainingAfterCp = Number(remaining) - Number(this.purposeAmmount);
  //     this.remainingAfterCpMinus = Math.round(Number(this.purposeAmmount) - Number(remaining));
  //     if (this.remainingAfterCp > 0) {
  //       this.status = 'Comply';
  //     } else {
  //       this.status = 'Breach The Limit';
  //     }
  //   });
  // }
}
