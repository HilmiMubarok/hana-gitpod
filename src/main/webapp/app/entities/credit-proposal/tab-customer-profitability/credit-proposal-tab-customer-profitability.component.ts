import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { PositionService } from '../../position/position.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CreditProposalService } from '../credit-proposal.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';

import { ICustomer } from './tab-customert-profitability.model';

import { Router } from '@angular/router';
@Component({
  selector: 'jhi-credit-proposal-tab-customer-profitability',
  templateUrl: './credit-proposal-Tab-Customer-Profitability.component.html',
  styleUrls: ['./credit-proposal-tab-customer-profitability.scss'],
})
export class CreditProposalTabCustomerProfitabilityComponent implements OnInit {
  dataAttr: Object[];
  dataSave: any[];
  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService,
    private router: Router // protected parseLinks: ParseLinks, // protected accoutService: AccountService, // protected activateRoute: ActivatedRoute, // protected dataUtils: BaseDataUtils, // protected router: Router, // protected eventManager: EventManager, // protected messageService: MessageService, // protected confirmationService: ConfirmationService
  ) // constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService, private router: Router) {}
  {}
  private _creditProposal: ICreditProposal;
  get creditProposal() {
    return this._creditProposal;
  }
  public grid: GridComponent;
  public data: Object[];

  public dataAttrPass = [
    {
      No: 1,
      parameter: 'Bank Acivity',
      value: 'No',
    },
    {
      No: 2,
      parameter: 'Time Deposit',
      value: 'No',
    },
    {
      No: 3,
      parameter: 'Casa',
      value: 'No',
    },
    {
      No: 4,
      parameter: 'Trade Finance',
      value: 'No',
    },
    {
      No: 5,
      parameter: 'payroll',
      value: 'No',
    },
    {
      No: 6,
      parameter: 'forex',
      value: 'No',
    },
    {
      No: 7,
      parameter: 'Personal Loan',
      value: 'No',
    },
  ];
  public creditProposaldata: ICreditProposal = new CreditProposal();

  public value: string;

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability = this.dataAttrPass;
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
    this.item.attributes['tabCustomer'].CustomerProfitability[data.id - 1].value = dataValue;
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
    this.item.attributes['tabCustomer'].CustomerProfitability = [
      ...this.item.attributes['tabCustomer'].CustomerProfitability,

      {
        id: this.item.attributes['tabCustomer'].CustomerProfitability.length + 1,
        parameter: this.parameter,
        remarks: this.remarks,
        value: this.value,
      },
    ];
    this.clearTextBox();
  }
  public clearTextBox(): void {
    this.parameter = '';
    this.remarks = '';
  }
  public deleteData(Id: any): void {
    const data = this.item.attributes['tabCustomer'].CustomerProfitability.filter(({ id }) => id !== Id);
    this.item.attributes['tabCustomer'].TabCustomerProfitability = data;
  }
  ngOnInit(): void {
    if (this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length === 0) {
      this.dataAttrPass;
    } else {
      this.data = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability;
      this.dataAttrPass = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability;
    }
    this.width = '50%';
    this.height = '80%';
  }
}

export const dataAttr: Object[] = [
  {
    No: 1,
    parameter: 'Bank Acivity',
    Verified: !0,
    value: 'A',
  },
  {
    No: 2,
    parameter: 'Time Deposit',
    Verified: !2,
    value: 'B',
  },
  {
    No: 3,
    parameter: 'Casa',
    Verified: !3,
    value: 'C',
  },
  {
    No: 4,
    parameter: 'Trade Finance',
    Verified: !4,
    value: 'D',
  },
  {
    No: 5,
    parameter: 'Payroll',
    Verified: !5,
    value: 'F',
  },
  {
    No: 6,
    parameter: 'Forex',
    Verified: !6,
    value: 'G',
  },
  {
    No: 7,
    parameter: 'Personal Loan',
    Verified: !7,
    value: 'H',
  },
];
