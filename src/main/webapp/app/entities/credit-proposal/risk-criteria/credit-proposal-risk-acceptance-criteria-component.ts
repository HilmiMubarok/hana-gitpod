import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { CreditProposal, ICreditProposal } from '../credit-proposal.model';

import { PositionService } from '../../position/position.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CreditProposalService } from '../credit-proposal.service';

import { GridComponent } from '@syncfusion/ej2-angular-grids';

import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria',
  templateUrl: './credit-proposal-risk-acceptance-criteria-component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalRiskAcceptanceCriteriaComponent implements OnInit {
  dataAttr: Object[];
  dataSave: any[];
  messageService: any;
  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService, private router: Router) {}
  private _creditProposal: ICreditProposal;
  get creditProposal() {
    console.log('this._creditProposal', this._creditProposal);
    return this._creditProposal;
  }
  public grid: GridComponent;
  public data: Object[];

  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'Is Individual Debtor Indonesia Citizen (WNI)?',
      value: 'Yes',
    },
    {
      No: 2,
      Parameter:
        'Is the result of SLICK Checking historucally and currently positive condition?Not for debtor,including shareholders,spouse,BOD/BOC.Exception only for CC with maximum usage rp.5mio or 5% of CC limit (which ever lower).',
      value: 'Yes',
    },
    {
      No: 3,
      Parameter: 'Is debtors industry included on watch list industry?',
      value: 'Yes',
    },
    {
      No: 4,
      Parameter: 'Will this facility comply with industry limit?',
      value: 'Yes',
    },
    {
      No: 5,
      Parameter: 'The purpose of loan is not for buying land',
      value: 'Yes',
    },
    {
      No: 6,
      Parameter:
        '"For Loan in US$ there must be natural hedging(ie.revenue must also in US$).However,if loan in US$ but revenue in IDR, there must be FX Hedging to cover FX Risk.',
      value: 'Yes',
    },
    {
      No: 7,
      Parameter: 'Debtor or Guarantor has positive profibility in the last 3 years.',
      value: 'Yes',
    },
    {
      No: 8,
      Parameter:
        'Are borrower/shareholders/managagements/Guarantor does not have Tax issue?Does not have any negative information (Legal,Criminal,Tax Dispute with other parties etc.)please check through google also.',
      value: 'Yes',
    },
  ];
  public creditProposaldata: ICreditProposal = new CreditProposal();
  public value: string;

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria = this.dataAttrPass;
  }

  public dialogVisible: boolean;
  public width?: string;
  public height?: string;
  public animationSettings?: Object;
  public closeOnEscape?: boolean;
  Dialog: any;

  public onOverlayClick(): void {
    this.dialogVisible = false;
  }

  public btnAdd(): void {
    this.dialogVisible = true;
  }
  public dataGrid: any = [];
  public Value: string;
  public selectValue = [];
  public valueSelectect = [];
  public OnSelect(dataValue: string, data: any): void {
    this.item.attributes['riksCriteria'].RiskAcceptanceCriteria[data.id - 1].value = dataValue;
  }

  onselectValue() {}

  public parameter: string;
  public remarks: string;

  @ViewChild('ddposition')
  public dropDownListObject: DropDownListComponent;
  public dropdownSub: string[] = [];

  attributes: any;
  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public btnSave($event: any): void {
    this.item.attributes['riksCriteria'].RiskAcceptanceCriteria = [
      ...this.item.attributes['riksCriteria'].RiskAcceptanceCriteria,

      {
        id: this.item.attributes['riksCriteria'].RiskAcceptanceCriteria.length + 1,
        parameter: this.parameter,
        remarks: this.remarks,
        value: this.value,
      },
    ];
    this.clearTextBox();

    this.dialogVisible = false;
  }

  public clearTextBox(): void {
    this.parameter = '';
    this.remarks = '';
  }

  public deleteData(Id: any): void {
    const data = this.item.attributes['riksCriteria'].RiskAcceptanceCriteria.filter(({ id }) => id !== Id);
    this.item.attributes['riksCriteria'].RiskAcceptanceCriteria = data;
  }

  ngOnInit(): void {
    console.log('this.item', this.item);
    if (this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria.length === 0) {
      this.data = this.dataAttrPass;
    } else {
      this.data = this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria;
      this.dataAttr = this.item.attributes['riksCriteria'].GeneralRiskAcceptanceCriteria;
    }

    this.width = '50%';
    this.height = '80%';
  }
}

export const dataAttr: Object[] = [
  {
    No: 1,
    Parameter: 'Is Individual Debtor Indonesia Citizen (WNI)?',
    Verified: !0,
    value: 'A',
  },
  {
    No: 2,
    Parameter:
      'Is the result of SLICK Checking historucally and currently positive condition?Not for debtor,including shareholders,spouse,BOD/BOC.Exception only for CC with maximum usage rp.5mio or 5% of CC limit (which ever lower).',
    Verified: !2,
    value: 'B',
  },
  {
    No: 3,
    Parameter: 'Is debtors industry included on watch list industry?',
    Verified: !3,
    value: 'C',
  },
  {
    No: 4,
    Parameter: 'Will this facility comply with industry limit?',
    Verified: !4,
    value: 'D',
  },
  {
    No: 5,
    Parameter: 'The purpose of loan is not for buying land',
    Verified: !5,
    value: 'E',
  },
  {
    No: 6,
    Parameter:
      '"For Loan in US$ there must be natural hedging(ie.revenue must also in US$).However,if loan in US$ but revenue in IDR, there must be FX Hedging to cover FX Risk.',
    Verified: !6,
    value: 'F',
  },
  {
    No: 7,
    Parameter: 'Debtor or Guarantor has positive profibility in the last 3 years.',
    Verified: !7,
    value: 'G',
  },
  {
    No: 8,
    Parameter:
      'Are borrower/shareholders/managagements/Guarantor does not have Tax issue?Does not have any negative information (Legal,Criminal,Tax Dispute with other parties etc.)please check through google also.',
    Verified: !8,
    value: 'G',
  },
];
