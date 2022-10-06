import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { PositionService } from '../../../position/position.service';
import { DropDownListComponent, BeforeOpenEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { CreditProposalService } from '../../credit-proposal.service';

import { GridComponent } from '@syncfusion/ej2-angular-grids';

import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-back-to-back',
  templateUrl: './credit-proposal-risk-acceptance-criteria-back-to-back-component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalAceptanceCriteriaBackToBackComponent implements OnInit {
  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService, private router: Router) {}

  public creditProposaldata: ICreditProposal = new CreditProposal();

  public onSelect(value: string, data: any): void {
    this.dataGridOne[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGrid = this.dataGridOne;
  }

  public documentType: string;
  public remarks: string;
  public value: string;

  attributes: any;
  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public btnSave($event: any): void {}

  public dataGridOne = [
    {
      No: 1,
      documentType: 'Have met the Anti Money Laundring requirements',
      Verified: !0,
      value: 'YES',
    },
    {
      No: 2,
      documentType: 'It has been checked that the debtor and the owner of the collateral do not have problems in taxation',
      Verified: !2,
      value: 'YES',
    },
    {
      No: 3,
      documentType: 'It has been checked that the debtor and the owner of the collateral do not have negative information',
      Verified: !3,
      value: 'YES',
    },
    {
      No: 4,
      documentType: 'Prospective debtors are not included in the PEP (Politically Exposed Person)',
      Verified: !4,
      value: 'YES',
    },
  ];

  public dataGridTwo = [
    {
      No: 1,
      documentType:
        'The minimum time deposit tenor is 12 (twelve) months and/or the minimum deposit tenor is the same as the credit facility period.',
      Verified: !0,
      value: 'YES',
    },
    {
      No: 2,
      documentType: 'Time deposits as a collateral and loans must be recorded at the same branch office',
      Verified: !2,
      value: 'YES',
    },
    {
      No: 3,
      documentType: 'Time Deposit placement must be done all at once and should not be done in stages',
      Verified: !3,
      value: 'YES',
    },
  ];

  public dataGridThre = [
    {
      No: 1,
      documentType: 'Hana Bank SBLC Financial Format Standard',
      Verified: !0,
      value: 'YES',
    },
    {
      No: 2,
      documentType: 'Issued by banks thats categorized as prime bank',
      Verified: !2,
      value: 'YES',
    },
    {
      No: 3,
      documentType:
        'The maturity date of the Standby L/C is at least 1 (one) month longer than the end date of the credit agreement or for SBLC from Hana Seoul, the SBLC period is 14 calendar days longer than the credit facility term.',
      Verified: !3,
      value: 'YES',
    },
  ];

  public dataGridFour = [
    {
      No: 1,
      documentType: 'Collateral and loan must be recorded at the same branch office.',
      Verified: !0,
      value: 'YES',
    },
    {
      No: 2,
      documentType: 'The placement of Savings/Giro funds must be all at once and may not be gradual.',
      Verified: !2,
      value: 'YES',
    },
  ];

  public dataGridFive = [
    {
      No: 1,
      documentType: 'Debiting must be done all at once and should not be done in stages.',
      Verified: !0,
      value: 'YES',
    },
  ];

  ngOnInit(): void {
    if (this.item.attributes['cpRacBack'].checklistValueBelow.length !== 0) {
      for (let i = 0; i < this.item.attributes['cpRacBack'].topGrid.length; i++) {
        this.dataGridOne = this.item.attributes['cpRacBack'].topGrid;
      }
    }
  }
}
