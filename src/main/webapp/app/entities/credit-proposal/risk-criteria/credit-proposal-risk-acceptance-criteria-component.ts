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
    return this._creditProposal;
  }
  public grid: GridComponent;
  public data: Object[];

  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'Debitur merupakah individu (Perorangan) , warga negara indonesia dan berdomisili indonesia',
      value: 'No',
    },
    {
      No: 2,
      Parameter: 'Age for individual debtors: Min. 24 years at the time of proposing loan, Max. 65 years at loan maturity date',
      value: 'No',
    },
    {
      No: 3,
      Parameter: 'Business location ≤ 30 KM from Hana Bank branch booking unit',
      value: 'No',
    },
    {
      No: 4,
      Parameter: 'Is the debtor industry included in the watch list industry?',
      value: 'No',
    },
    {
      No: 5,
      Parameter: 'Not included in the National Black List (DHN) of Bank Indonesia',
      value: 'No',
    },
    {
      No: 6,
      Parameter: 'The purpose of applying for credit is not for buying land',
      value: 'No',
    },
    {
      No: 7,
      Parameter: 'Not a Political Exposed Person (PEP) -> includes spouse, BOD & BOC debtors',
      value: 'No',
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
    Parameter: 'Debitur merupakah individu (Perorangan) , warga negara indonesia dan berdomisili indonesia',
    Verified: !0,
    value: 'A',
  },
  {
    No: 2,
    Parameter: 'Age for individual debtors: Min. 24 years at the time of proposing loan, Max. 65 years at loan maturity date',
    Verified: !2,
    value: 'B',
  },
  {
    No: 3,
    Parameter: 'Business location ≤ 30 KM from Hana Bank branch booking unit',
    Verified: !3,
    value: 'C',
  },
  {
    No: 4,
    Parameter: 'Is the debtor industry included in the watch list industry?',
    Verified: !4,
    value: 'D',
  },
  {
    No: 5,
    Parameter: 'Not included in the National Black List (DHN) of Bank Indonesia',
    Verified: !5,
    value: 'E',
  },
  {
    No: 6,
    Parameter: 'The purpose of applying for credit is not for buying land',
    Verified: !6,
    value: 'F',
  },
  {
    No: 7,
    Parameter: 'Not a Political Exposed Person (PEP) -> includes spouse, BOD & BOC debtors',
    Verified: !7,
    value: 'G',
  },
];
