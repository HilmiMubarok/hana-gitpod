import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { ribbonClick } from '@syncfusion/ej2-angular-spreadsheet';
import { PositionService } from 'app/entities/position/position.service';
import { CreditProposal, ICreditProposal } from '../credit-proposal.model';
import { CreditProposalService } from '../credit-proposal.service';
// import { data } from './datasource';

@Component({
  selector: 'jhi-credit-proposal-busines-activity',
  templateUrl: './credit-proposal-tab-business-activity.component.html',
  styleUrls: ['../css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabBusinessActivityComponent implements OnInit, OnChanges {
  private _creditProposalItem: ICreditProposal;

  public dataAttrPass = [
    {
      No: 1,
      Parameter: 'There was no delay in previous projects undertaken',
      value: 'No',
    },
    {
      No: 2,
      Parameter: 'There was no cost over-run in previous project undertaken',
      value: 'No',
    },
    {
      No: 3,
      Parameter: 'Previous projects achieved 100% sales',
      value: 'No',
    },
    {
      No: 4,
      Parameter: 'There is standing instruction for payment form Bouwheer to Escrow Account in KEB Hana directly',
      value: 'No',
    },
    {
      No: 5,
      Parameter: 'There was no delay in obtaining relevant project approvals from the relevant approving authorities',
      value: 'No',
    },
    {
      No: 6,
      Parameter: 'Max financing 70% of activity progress that is explained in Contract',
      value: 'No',
    },
    {
      No: 7,
      Parameter: 'There was no disputes or legal action taken against contractors, sub-contractors or suppliers',
      value: 'No',
    },
  ];

  attributes: any;
  public _item: ICreditProposal;
  public _projectAnalysis: string;

  @Input()
  get creditProposalItem() {
    return this._item;
  }
  set creditProposalItem(item: ICreditProposal) {
    this._item = item;
  }

  public tes() {
    // if (this.creditProposalItem.attributes['businessActivity']['BusinessAct'].length === 0) {
    //   this.datax = this.dataAttrPass;

    // } else {
    //   this.creditProposalItem.attributes['businessActivity']['BusinessAct'] ;
    //   console.log('tess', this.creditProposalItem.attributes['businessActivity']['BusinessAct'] );

    // }
    if (this.creditProposalItem.attributes['businessActivity'].BusinessAct.length !== 0) {
      for (let i = 0; i < this.creditProposalItem.attributes['businessActivity'].BusinessAct.length; i++) {
        this.dataAttrPass = this.creditProposalItem.attributes['businessActivity'].BusinessAct;
      }
    }
  }

  // @Input() public projectAnalysis: string;
  @Input()
  get projectAnalysis() {
    return this._projectAnalysis;
  }
  set projectAnalysis(item: any) {
    this.selectedMenu = 'BUSINESS ACTIVITY';
  }

  // @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService, private router: Router) {}

  public creditProposaldata: ICreditProposal = new CreditProposal();
  public value: string;

  dataAttr: Object[];

  public datax: any[];

  public onSelect(value: string, data: any): void {
    this.dataAttrPass[data.No - 1].value = value;
    this.creditProposalItem.attributes['businessActivity'].BusinessAct = this.dataAttrPass;
    // this.datax[data.index].value = value;
  }

  public parameter: string;
  public notesPa?: string;

  btnSave($event: any): void {
    this.creditProposalItem.attributes['businessActivity'].BusinessAct = [
      ...this.creditProposalItem.attributes['businessActivity'].BusinessAct,
      {
        parameter: this.parameter,
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._item.attributes['businessActivity'].notesPa === undefined) {
      this._item.attributes['businessActivity'].notesPa = '';
    }
  }

  ngOnInit() {
    this.selectedMenu = 'BUSINESS ACTIVITY';
    this.tes();
    /* this.datax = dataAttr;
    if (this.item.attributes['businessActivity'].BusinessAct.length === 0) {
      this.datax = this.dataAttrPass;
    } else {
      this.datax = this.item.attributes['businessActivity'].BusinessAct;
      this.dataAttr = this.item.attributes['businessActivity'].BusinessAct;
    } */
  }

  public selectedMenu: string;

  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  public menuItems: MenuItemModel[] = [
    { text: 'BUSINESS ACTIVITY' },
    {
      text: 'PROJECT ANALYSIS',
    },
  ];

  public tools: object = {
    items: [
      'FontName',
      'FontSize',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      'FontColor',
      'BackgroundColor',
      'OrderedList',
      'UnorderedList',
      'Indent',
      'Outdent',
      'SuperScript',
      'SubScript',
      'Alignments',
      'CreateLink',
    ],
  };
}
// export const dataAttr: Object[] = [
//   {
//     No: 1,
//     Parameter: 'There was no delay in previous projects undertaken',
//     Verified: !0,
//     value: 'A',
//   },
//   {
//     No: 2,
//     Parameter: 'There was no cost over-run in previous project undertaken',
//     Verified: !2,
//     value: 'B',
//   },
//   {
//     No: 3,
//     Parameter: 'Previous projects achieved 100% sales',
//     Verified: !3,
//     value: 'C',
//   },
//   {
//     No: 4,
//     Parameter: 'There is standing instruction for payment form Bouwheer to Escrow Account in KEB Hana directly',
//     Verified: !4,
//     value: 'D',
//   },
//   {
//     No: 5,
//     Parameter: 'There was no delay in obtaining relevant project approvals from the relevant approving authorities',
//     Verified: !5,
//     value: 'E',
//   },
//   {
//     No: 6,
//     Parameter: 'Max financing 70% of activity progress that is explained in Contract',
//     Verified: !6,
//     value: 'F',
//   },
//   {
//     No: 7,
//     Parameter: 'There was no disputes or legal action taken against contractors, sub-contractors or suppliers',
//     Verified: !7,
//     value: 'G',
//   },
// ];
