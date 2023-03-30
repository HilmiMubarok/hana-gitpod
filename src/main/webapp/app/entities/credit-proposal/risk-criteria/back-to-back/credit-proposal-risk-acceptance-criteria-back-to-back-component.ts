import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { PositionService } from '../../../position/position.service';
import { DropDownListComponent, BeforeOpenEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { CreditProposalService } from '../../credit-proposal.service';

import { GridComponent } from '@syncfusion/ej2-angular-grids';

import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import lodash from 'lodash';
@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-back-to-back',
  templateUrl: './credit-proposal-risk-acceptance-criteria-back-to-back-component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalAceptanceCriteriaBackToBackComponent implements OnInit {
  constructor(
    protected creditProposalService: CreditProposalService,
    private generalParameterService: GeneralParameterService,
    protected positionService: PositionService,
    private router: Router
  ) {}

  public creditProposaldata: ICreditProposal = new CreditProposal();

  public onSelect(value: string, data: any): void {
    this.dataGridOne[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGrid = this.dataGridOne;
  }

  public documentType: string;
  public remarks?: any = [];
  public remarksTwo?: any = [];
  public remarksThere?: any = [];
  public remarksFour?: any = [];
  public remarksFive?: any = [];
  public value: string;

  attributes: any;
  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: ICreditProposal) {
    this._item = item;
  }

  public OnSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataGridOne[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGrid = this.dataGridOne;
  }

  public OnnSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataGridTwo[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGridTwo = this.dataGridTwo;
  }

  public OnNSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataGridThre[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGridThere = this.dataGridThre;
  }

  public OnNSeleect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataGridFour[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGridFour = this.dataGridFour;
  }

  public OnNSelectt(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataGridFive[data.No - 1].value = value;
    this.item.attributes['cpRacBack'].topGridFive = this.dataGridFive;
  }
  public dataGridOne = [];
  public dataGridTwo = [];
  public dataGridThre = [];
  public dataGridFour = [];
  public dataGridFive = [];

  // public dataGridOne = [
  //   {
  //     No: 1,
  //     // documentType: 'Have met the Anti Money Laundring requirements',
  //     value: 'Yes',
  //     remarks: '',
  //   },
  //   {
  //     No: 2,
  //     // documentType:'It has been checked that the debtor and the owner of the collateral do not have problems in taxation',
  //     value: 'Yes',
  //     remarks: '',
  //   },
  //   {
  //     No: 3,
  //     // documentType: 'It has been checked that the debtor and the owner of the collateral do not have negative information',
  //     value: 'Yes',
  //     remarks: '',
  //   },
  //   {
  //     No: 4,
  //     // documentType: 'Prospective debtors are not included in the PEP (Politically Exposed Person)',
  //     value: 'Yes',
  //     remarks: '',
  //   },
  // ];

  // public dataGridTwo = [
  //   {
  //     No: 1,
  //     documentType:
  //       'The minimum time deposit tenor is 12 (twelve) months and/or the minimum deposit tenor is the same as the credit facility period.',

  //     value: 'Yes',
  //     remarksTwo: '',
  //   },
  //   {
  //     No: 2,
  //     documentType: 'Time deposits as a collateral and loans must be recorded at the same branch office',

  //     value: 'Yes',
  //     remarksTwo: '',
  //   },
  //   {
  //     No: 3,
  //     documentType: 'Time Deposit placement must be done all at once and should not be done in stages',

  //     value: 'Yes',
  //     remarksTwo: '',
  //   },
  // ];

  // public dataGridThre = [
  //   {
  //     No: 1,
  //     documentType: 'Hana Bank SBLC Financial Format Standard',

  //     value: 'Yes',
  //     remarksThere: '',
  //   },
  //   {
  //     No: 2,
  //     documentType: 'Issued by banks thats categorized as prime bank',

  //     value: 'Yes',
  //     remarksThere: '',
  //   },
  //   {
  //     No: 3,
  //     documentType:
  //       'The maturity date of the Standby L/C is at least 1 (one) month longer than the end date of the credit agreement or for SBLC from Hana Seoul, the SBLC period is 14 calendar days longer than the credit facility term.',

  //     value: 'Yes',
  //     remarksThere: '',
  //   },
  // ];

  // public dataGridFour = [
  //   {
  //     No: 1,
  //     documentType: 'Collateral and loan must be recorded at the same branch office.',

  //     value: 'Yes',
  //     remarksFour: '',
  //   },
  //   {
  //     No: 2,
  //     documentType: 'The placement of Savings/Giro funds must be all at once and may not be gradual.',

  //     value: 'Yes',
  //     remarksFour: '',
  //   },
  // ];

  // public dataGridFive = [
  //   {
  //     No: 1,
  //     documentType: 'Debiting must be done all at once and should not be done in stages.',

  //     value: 'Yes',
  //     remarksFive: '',
  //   },
  // ];
  onKeyUpEvent() {
    for (let h = 0; h < this.dataGridOne.length; h++) {
      this.dataGridOne[h].remarks = this.remarks[h];
    }

    this.item.attributes['cpRacBack'].remarks = this.dataGridOne;
  }

  OnKeyUpEvent() {
    for (let h = 0; h < this.dataGridTwo.length; h++) {
      this.dataGridTwo[h].remarksTwo = this.remarksTwo[h];
    }

    this.item.attributes['cpRacBack'].remarksTwo = this.dataGridTwo;
  }

  OnKeyyUpEvent() {
    for (let h = 0; h < this.dataGridThre.length; h++) {
      this.dataGridThre[h].remarksThere = this.remarksThere[h];
    }

    this.item.attributes['cpRacBack'].remarksThere = this.remarksThere;
  }

  OnKeyyUppEvent() {
    for (let h = 0; h < this.dataGridFour.length; h++) {
      this.dataGridFour[h].remarksFour = this.remarksFour[h];
    }

    this.item.attributes['cpRacBack'].remarksFour = this.remarksFour;
  }

  OnKeyyUppEventt() {
    for (let h = 0; h < this.dataGridFive.length; h++) {
      this.dataGridFive[h].remarksFive = this.remarksFive[h];
    }

    this.item.attributes['cpRacBack'].remarksFive = this.remarksFive;
  }

  ngOnInit(): void {
    this.refreshRacBackToBack();
    this.lovGernerat();
    this.lovTimeDeposit();
    this.lovSblc();
    this.savingCurrent();
    this.cashMargin();
  }
  public lovGernerat() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BTB_GENERAL',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataGridOne = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.dataGridOne.length; i++) {
          this.dataGridOne[i]['No'] = i + 1;
        }
      });
  }
  public lovTimeDeposit() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BTB_TIME_DEPOSIT',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataGridTwo = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.dataGridTwo.length; i++) {
          this.dataGridTwo[i]['No'] = i + 1;
        }
      });
  }

  public lovSblc() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BTB_SLBC',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataGridThre = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.dataGridThre.length; i++) {
          this.dataGridThre[i]['No'] = i + 1;
        }
      });
  }

  public savingCurrent() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BTB_SAVING_CURRENT_ACCOUNT',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataGridFour = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.dataGridFour.length; i++) {
          this.dataGridFour[i]['No'] = i + 1;
        }
      });
  }

  public cashMargin() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RAC_BTB_CASH_MARGIN',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.dataGridFive = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        for (let i = 0; i < this.dataGridFive.length; i++) {
          this.dataGridFive[i]['No'] = i + 1;
        }
      });
  }

  public refreshRacBackToBack() {
    if (this.item.attributes['cpRacBack'].topGrid.length === 0) {
      this.item.attributes['cpRacBack'].topGrid = this.dataGridOne;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBack'].topGrid.length; i++) {
        this.dataGridOne = this.item.attributes['cpRacBack'].topGrid;
        this.remarks[i] = this.item.attributes['cpRacBack'].topGrid[i].remarks;
      }
    }

    if (this.item.attributes['cpRacBack'].topGridTwo.length === 0) {
      this.item.attributes['cpRacBack'].topGridTwo = this.dataGridTwo;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBack'].topGridTwo.length; i++) {
        this.dataGridTwo = this.item.attributes['cpRacBack'].topGridTwo;
        this.remarksTwo[i] = this.item.attributes['cpRacBack'].topGridTwo[i].remarksTwo;
      }
    }

    if (this.item.attributes['cpRacBack'].topGridThere.length === 0) {
      this.item.attributes['cpRacBack'].topGridThere = this.dataGridThre;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBack'].topGridThere.length; i++) {
        this.dataGridThre = this.item.attributes['cpRacBack'].topGridThere;
        this.remarksThere[i] = this.item.attributes['cpRacBack'].topGridThere[i].remarksThere;
      }
    }

    if (this.item.attributes['cpRacBack'].topGridFour.length === 0) {
      this.item.attributes['cpRacBack'].topGridFour = this.dataGridFour;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBack'].topGridFour.length; i++) {
        this.dataGridFour = this.item.attributes['cpRacBack'].topGridFour;
        this.remarksFour[i] = this.item.attributes['cpRacBack'].topGridFour[i].remarksFour;
      }
    }

    if (this.item.attributes['cpRacBack'].topGridFive.length === 0) {
      this.item.attributes['cpRacBack'].topGridFive = this.dataGridFive;
    } else {
      for (let i = 0; i < this.item.attributes['cpRacBack'].topGridFive.length; i++) {
        this.dataGridFive = this.item.attributes['cpRacBack'].topGridFive;
        this.remarksFive[i] = this.item.attributes['cpRacBack'].topGridFive[i].remarksFive;
      }
    }
  }
}
