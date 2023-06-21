import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICreditProposal } from '../credit-proposal.model';
import lodash from 'lodash';
import { BankAccountAnalyst, IBankAccountAnalyst } from '../bank-account-analyst/bank-account-analyst.model';
import { TABLE } from '@syncfusion/ej2-angular-richtexteditor';
import { IRepaymentCapability, IRepaymentCapabilityDetail, RepaymentCapability } from './repayment-capability.constant';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'jhi-credit-proposal-repayment-capability',
  templateUrl: './credit-proposal-repayment-capability.component.html',
  styleUrls: ['./repayment-capability.scss'],
})
export class CreditProposalRepaymentCapabilityComponent implements OnChanges {
  private _creditProposal: ICreditProposal;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(data: ICreditProposal) {
    this._creditProposal = data;
  }

  public statusSalesEbit?: Boolean = false;
  public statusCreditMutation?: Boolean = false;
  public creditMutation: any;
  public creditMutationAv = 0;
  public debitMutationAv = 0;
  public totalAv = 0;
  public totalIncome = 0;
  public existingFs = 0;
  public monthlySalesEbit: any;
  public idAnalis = '';
  public repayment: IRepaymentCapabilityDetail;

  public validExistingFS = new FormControl('', [Validators.required]);
  public validExistingCR = new FormControl('', [Validators.required]);
  public validCurrentProposalFS = new FormControl('', [Validators.required]);
  public validCurrentProposalCR = new FormControl('', [Validators.required]);

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    // this.AverageBalance();
    this.bufferFs();
    this.bufferAverage();
    this.bufferCredit();
    this.bufferIncomeFs();
    this.bufferIncomeAvg();
    this.bufferIncomeCredit();
  }

  public valueMonthlySalesEbit() {
    const margin = 12;

    const ebit = this.creditProposal.attributes['repaymentCapability'][0]['detail']['monthlySalesEbit'];

    this.monthlySalesEbit = Number(ebit / margin);

    this.creditProposal.attributes['repaymentCapability'][0]['detail']['monthlySalesEbit'] = this.monthlySalesEbit;
  }

  // public fungsiCreditMutation() {
  //   for (let i = 0; i < this._creditProposal.attributes['bankAnalyst'].length; i++) {
  //     // console.log('Tester', this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit']);
  //     this.creditMutation =
  //       this.creditProposal.attributes['repaymentCapability'][0]['detail']['creditMutationMargin'] *
  //       Number(this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit'] / 1000000);

  //     console.log('Tester', this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit']);
  //   }
  //   this.creditProposal.attributes['repaymentCapability'][0]['detail']['creditMutationMargin'] = this.creditMutation;
  // }

  public limitBank: any;
  // public AverageBalance() {
  //   for (let i = 0; i < this.creditProposal.attributes['bankAnalyst'].length; i++) {
  //     if (this._creditProposal.attributes['bankAnalyst'] === undefined) {
  //       return
  //     } else {
  //       this.totalAv = this.totalAv + this._creditProposal.attributes['bankAnalyst'][i]['average_other'].balance / 1000000;
  //     }

  //     this.creditProposal.attributes['repaymentCapability'][0]['detail']['averageBalance'] = this.totalAv;
  //   }
  // }

  // public bufferFs(): Number {
  //   this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferFs'] = Number(
  //     this.creditProposal.attributes['repaymentCapability'][0]['detail']['monthlySalesEbit'] -
  //       this.creditProposal.attributes['repaymentCapability'][0]['detail']['existingFs'] -
  //       this.creditProposal.attributes['repaymentCapability'][0]['detail']['currentProposalFs']
  //   );
  //   return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferFs'];
  // }
  public bufferFs(): number {
    const monthlySalesEbit = this.creditProposal.attributes['repaymentCapability'][0]['detail']['monthlySalesEbit'];
    const existingFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['existingFs'];
    const currentProposalFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['currentProposalFs'];

    const bufferFs = monthlySalesEbit - existingFs - currentProposalFs;
    this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferFs'] = isNaN(bufferFs) ? 0 : bufferFs;

    return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferFs'];
  }

  public bufferAverage() {
    const averageBalance = this.creditProposal.attributes['repaymentCapability'][0]['detail']['averageBalance'];
    const existingFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['existingFs'];
    const currentProposalFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['currentProposalFs'];
    const bufferAvg = averageBalance - existingFs - currentProposalFs;
    this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferAverage'] = isNaN(bufferAvg) ? 0 : bufferAvg;

    return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferAverage'];
  }

  public bufferCredit() {
    const creditMutationMargin = this.creditProposal.attributes['repaymentCapability'][0]['detail']['creditMutationMargin'];
    const existingFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['existingFs'];
    const currentProposalFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['currentProposalFs'];

    const bufferCredit = creditMutationMargin - existingFs - currentProposalFs;
    this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferCredit'] = isNaN(bufferCredit) ? 0 : bufferCredit;
    return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferCredit'];
  }

  public bufferIncomeFs() {
    const bufferFs = this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferFs'];
    const monthlySalesEbit = this.creditProposal.attributes['repaymentCapability'][0]['detail']['monthlySalesEbit'];

    if (bufferFs === 0 || monthlySalesEbit === 0) {
      this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeFs'] = 0;
    } else {
      const bufferIncomeFs = (bufferFs / monthlySalesEbit) * 100;
      this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeFs'] = isNaN(bufferIncomeFs) ? 0 : bufferIncomeFs;
    }

    return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeFs'];
  }

  public bufferIncomeAvg() {
    const bufferAverage = this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferAverage'];
    const averageBalance = this.creditProposal.attributes['repaymentCapability'][0]['detail']['averageBalance'];
    if (bufferAverage === 0 || averageBalance === 0) {
      this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeAverage'] = 0;
    } else {
      const bufferIncomeAvg = (bufferAverage / averageBalance) * 100;
      this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeAverage'] = isNaN(bufferIncomeAvg)
        ? 0
        : bufferIncomeAvg;
    }
    return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeAverage'];
  }

  public bufferIncomeCredit() {
    const bufferCredit = this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferCredit'];
    const creditMutationMargin = this.creditProposal.attributes['repaymentCapability'][0]['detail']['averagcreditMutationMargineBalance'];

    if (bufferCredit === 0 || creditMutationMargin === 0) {
      this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeCredit'] = 0;
    } else {
      const bufferIncomeCredit = (bufferCredit / creditMutationMargin) * 100;
      this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeCredit'] = isNaN(bufferIncomeCredit)
        ? 0
        : bufferIncomeCredit;
    }
    return this.creditProposal.attributes['repaymentCapability'][0]['detail']['bufferIncomeCredit'];
  }
  numberInputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
    const num = value.replace(/[IDR,]/g, '');
    return String(num);
  }
}
