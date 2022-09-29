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

  public creditMutation = 0;
  public creditMutationAv = 0;
  public debitMutationAv = 0;
  public totalAv = 0;
  public totalIncome = 0;
  public existingFs = 0;
  public idAnalis = '';
  public repayment: IRepaymentCapabilityDetail;

  public validExistingFS = new FormControl('', [Validators.required]);
  public validExistingCR = new FormControl('', [Validators.required]);
  public validCurrentProposalFS = new FormControl('', [Validators.required]);
  public validCurrentProposalCR = new FormControl('', [Validators.required]);



  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.fungsiCreditMutation();
  }


  fungsiCreditMutation() {
    for (let i = 0; i < this._creditProposal.attributes['bankAnalyst'][i]['detail'].length; i++) {
      // console.log('Tester', this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit']);
      if (
        this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit'] === undefined ||
        this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['debit'] === undefined
      ) {
        console.log('masuk');
      } else {
        this.creditMutation =
          this.creditMutation +
          Number(
            (this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit'] / 1000000) *
            (this.creditProposal.attributes['proformaLaporanKeuangan'][0]['detail']['totalSales'] -
              this.creditProposal.attributes['proformaLaporanKeuangan'][0]['detail']['cogs'] -
              this.creditProposal.attributes['proformaLaporanKeuangan'][0]['detail']['sga'] /
              this.creditProposal.attributes['proformaLaporanKeuangan'][0]['detail']['totalSales'])
          );

        this.totalAv =
          this.totalAv +
          Number(
            this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['balance'] +
            this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['balance']
          );
        console.log('Credit', this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit']);

        console.log('Tester', this._creditProposal.attributes['bankAnalyst'][i]['detail'][i]['credit']);
      }
    }
  }

  numberInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return String(num);
  }
}
