import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Double } from '@syncfusion/ej2-angular-charts';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { PositionService } from '../../position/position.service';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
import { ICustomer, TabCustomerProfitability } from './tab-customert-profitability.model';
import { CurrencyMaskConfig } from 'ngx-currency';

@Component({
  selector: 'jhi-credit-proposal-tab-customer-profitability',
  templateUrl: './credit-proposal-tab-customer-profitability.component.html',
  styleUrls: ['./credit-proposal-tab-customer-profitability.scss'],
})
export class CreditProposalTabCustomerProfitabilityComponent implements OnInit, OnChanges {
  dataAttr: Object[];
  dataSave: any[];
  constructor(
    protected creditProposalService: CreditProposalService,
    protected positionService: PositionService // protected parseLinks: ParseLinks, // protected accoutService: AccountService, // protected activateRoute: ActivatedRoute, // protected dataUtils: BaseDataUtils, // protected router: Router, // protected eventManager: EventManager, // protected messageService: MessageService, // protected confirmationService: ConfirmationService
  ) {}

  public creditProposaldata: ICreditProposal = new CreditProposal();

  public loan = 0;
  public casa = 0;
  public other = 0;
  public provision = 0;
  public avarage = 0;
  public profit: number;
  public roa: number;
  public value: string;
  public parameter: string;
  public remarks: string;
  public remarks1?: any = [];

  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'Bank Acivity',
      value: 'No',
      remarks1: '',
    },
    {
      No: 2,
      Parameter: 'Time Deposit',
      value: 'No',
      remarks1: '',
    },
    {
      No: 3,
      Parameter: 'Casa',
      value: 'No',
      remarks1: '',
    },
    {
      No: 4,
      Parameter: 'Trade Finance',
      value: 'No',
      remarks1: '',
    },
    {
      No: 5,
      Parameter: 'payroll',
      value: 'No',
      remarks1: '',
    },
    {
      No: 6,
      Parameter: 'forex',
      value: 'No',
      remarks1: '',
    },
    {
      No: 7,
      Parameter: 'Personal Loan',
      value: 'No',
      remarks1: '',
    },
  ];

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

  onselectValue() {}

  onKeyUpEvent() {
    for (let h = 0; h < this.dataAttrPass.length; h++) {
      this.dataAttrPass[h].remarks1 = this.remarks1[h];
    }

    this.item.attributes['tabCustomer'].remarks1 = this.dataAttrPass;
  }

  attributes: any;
  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public sum() {
    this.profit =
      Number(this.item.attributes['tabCustomer']['loan']) +
      Number(this.item.attributes['tabCustomer']['casa']) +
      Number(this.item.attributes['tabCustomer']['Other']) +
      Number(this.item.attributes['tabCustomer']['Provision']);

    this.roa = this.profit / Number(this.item.attributes['tabCustomer']['avarage']);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sum();
  }
  public btnSave($event: any): void {
    this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability = [
      ...this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability,

      {
        loan: this.loan,
        casa: this.casa,
        other: this.other,
        provision: this.provision,
        avarage: this.avarage,
        profit: this.profit,
        Parameter: this.parameter,
        remarks: this.remarks,
        remak: this.remarks1,
      },
    ];
  }

  ngOnInit(): void {
    if (this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length !== 0) {
      for (let i = 0; i < this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability.length; i++) {
        this.dataAttrPass = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability;
        this.remarks1[i] = this.item.attributes['tabCustomer'].GeneralTabCustomerProfitability[i].remarks1;
      }
    }

    this.width = '50%';
    this.height = '80%';
  }
}
