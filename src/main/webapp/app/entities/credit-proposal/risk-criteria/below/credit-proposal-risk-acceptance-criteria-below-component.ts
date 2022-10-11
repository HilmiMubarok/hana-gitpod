import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { PositionService } from '../../../position/position.service';
import { CreditProposalService } from '../../credit-proposal.service';
import { RisksAcceptenceCriteria } from '../risk-criteria.model';
import lodash from 'lodash';
// import { dataKeyUp } from './risk-criteria-below.model';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-below',
  templateUrl: './credit-proposal-risk-acceptance-criteria-below-component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalRiskAcceptanceCriteriaBelowComponent implements OnInit {
  attributes: any;
  public parameterBelow: string;
  public value: string;
  public statusValue: any = [];
  public remarks?: any = [];
  public status: any = [];
  public dataInput: any = [];

  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService) {}
  public _item: ICreditProposal;
  public data: Object[];

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  public onSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataBelowChecklist[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValueBot = this.dataBelowChecklist;
  }

  public OnSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataBelowChecklistBot[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuTwo = this.dataBelowChecklistBot;
  }

  public OnnSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataBelowChecklistBF[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuThere = this.dataBelowChecklistBF;
  }

  public OnNSelect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataBelowChecklistCollateral[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuFour = this.dataBelowChecklistCollateral;
  }

  public OnNSeleect(value: string, data: any): void {
    // console.log('bot', data, value);

    this.dataBelowChecklistExclusively[data.No - 1].value = value;
    this.item.attributes['cpRacBelow'].cpValeuFive = this.dataBelowChecklistExclusively;
  }

  // ini bisa
  onKeyUpEvent() {
    for (let h = 0; h < this.dataBelowChecklist.length; h++) {
      this.dataBelowChecklist[h].remarks = this.remarks[h];
    }

    this.item.attributes['cpRacBelow'].remarks = this.dataBelowChecklist;
  }

  // public onKeyUpEvent(input: string, event: any, data: any, value: string) {
  //   if (this.item.attributes['riksCriteria'].cpValueBot.length !== 0) {
  //     for (let i = 0; i < this.dataBelowChecklist.length; i++) {
  //       if (i === Number(data.index)) {

  //         this.dataBelowChecklist[i].remarks = input === 'remarks' ? event.target.value : this.dataBelowChecklist[i].remaks;

  //       }

  //       this.dataBelowChecklist[i].remaks = this.remaks[i];
  //     }
  //   }
  // }

  // for grid one
  public dataBelowChecklist = [
    {
      No: 1,
      parameterBelow: 'Debitur merupakan individu (perorangan), Warga Negara Indonesia (WNI) dan berdomisili di Indonesia?',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 2,
      parameterBelow: 'Umur untuk debitur perorangan: Min. 24 tahun saat pengajuan, Max. 65 tahun pada saat jatem kredit',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 3,
      parameterBelow: 'Lokasi usaha ≤ 30 KM dari booking unit cabang Hana Bank',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 4,
      parameterBelow: 'Apakah industri debitur termasuk dalam watch list industry?',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 5,
      parameterBelow: 'Tidak termasuk dalam Daftar Hitam Nasional (DHN) Bank Indonesia',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 6,
      parameterBelow: 'Tujuan pengajuan kredit bukan untuk pembelian tanah',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 7,
      parameterBelow: 'Bukan merupakan Political Exposed Person (PEP) -> termasuk pasangan kawin, BOD & BOC debitur',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 8,
      parameterBelow:
        'Apakah debitur / pemegang saham / manajemen / guarantor tidak memiliki permasalahan pajak dan tidak memiliki info negatif lainnya? (Hukum, kriminal, sengketa dengan pihak lainnya, dsb.) Mohon juga dilakukan pengecekan melalui google.',
      value: 'Yes',
      remarks: '',
    },
    {
      No: 9,
      parameterBelow: 'Debitur tidak memiliki obligor di Bank KEB Hana Indonesia*',
      value: 'Yes',
      remarks: '',
    },
  ];

  // for grid two
  public dataBelowChecklistBot = [
    {
      No: 1,
      parameterBelow: 'Have experience and a business that has been running for 3 years',
      value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Key Person maximum age 65 years or already have a successor',
      value: 'Yes',
    },
    {
      No: 3,
      parameterBelow:
        'Verify the location of the debtors house / business owner where the house is in accordance with (reflecting) the financial data provNoed, the community and the number of debtor credit applications.',
      value: 'Yes',
    },
    {
      No: 4,
      parameterBelow:
        'There has been no change in the core management position in the last 3 years and the Key person is the owner or one of the shareholders families',
      value: 'Yes',
    },
    {
      No: 5,
      parameterBelow: 'The composition of shareholders is family (family business)',
      value: 'Yes',
    },
    {
      No: 6,
      parameterBelow: 'The results of the visit to the business location were positive and the business ran smoothly.',
      value: 'Yes',
    },
    {
      No: 7,
      parameterBelow: 'The results of Trade checking & Community checking (KYC) are positive',
      value: 'Yes',
    },
  ];

  // for grNo there
  public dataBelowChecklistBF = [
    {
      No: 1,
      parameterBelow: 'Business location is own property (not lease/contract)',
      value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Sales are stable or increasing in the last 3 years',
      value: 'Yes',
    },
    {
      No: 3,
      parameterBelow:
        'Minimum 80% verified sales on:-Account mutations for the last 3 months, and/or-Recapitulation of PO and Invoice for the last 3 months according to interview results and valid evidence',
      value: 'Yes',
    },
    {
      No: 4,
      parameterBelow: 'Number of buyers (buyer) > 5 (not concentrated on 1 or 2 buyers)',
      value: 'Yes',
    },
    {
      No: 5,
      parameterBelow:
        'There is no late payment of principal and / or interest (past due) for 3x in the last 6 months, and there is no clearing rejection for any reason.',
      value: 'Yes',
    },
    {
      No: 6,
      parameterBelow: 'Total bank financing is a maximum of 80% of working capital requirements',
      value: 'Yes',
    },
    {
      No: 7,
      parameterBelow:
        'Average monthly balance in account/savings mutation > 3 months debtors obligation. (including loan facility unused as cashflow)',
      value: 'Yes',
    },
    {
      No: 8,
      parameterBelow: 'Average credit utilization in the last 3 months 80%, credit card utilization 50% in the last 3 months',
      value: 'Yes',
    },
    {
      No: 9,
      parameterBelow: 'No clearing rejection for any reason',
      value: 'Yes',
    },
    {
      No: 10,
      parameterBelow: 'Positive SLIK checking (DPD is allowed only for CC utilization up to 5% of the limit or due to annual fee',
      value: 'Yes',
    },
  ];

  // for grid four
  public dataBelowChecklistCollateral = [
    {
      No: 1,
      parameterBelow: 'Collateral on behalf of: Debtor / Married partner / parents / shareholder / married partner shareholder',
      value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Not included in the Negative List Collateral',
      value: 'Yes',
    },
    {
      No: 3,
      parameterBelow: 'Located in a city / residential / industrial area / commercial area with good / fair marketability.',
      value: 'Yes',
    },
    {
      No: 4,
      parameterBelow:
        'Guarantee status: SHGB / SHM / SHMSRS and certificate maturity 2 years upon maturity of IL / WCI and 5 years for DL / OD.',
      value: 'Yes',
    },
    {
      No: 5,
      parameterBelow: 'The age of the security owner is 65 years and the security owner is the debtor / spouse / parent or shareholder.',
      value: 'Yes',
    },
  ];

  // for grid five
  public dataBelowChecklistExclusively = [
    {
      No: 1,
      parameterBelow: 'Debtors have deposits / CASA at KEB Hana Bank',
      value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Account activity at KEB Hana Bank',
      value: 'Yes',
    },
    {
      No: 3,
      parameterBelow: 'Been a debtor 3 years',
      value: 'Yes',
    },
    {
      No: 4,
      parameterBelow: 'Total loan exposure (incl. other banks) equals or decreases',
      value: 'Yes',
    },
  ];

  public Cs: string;
  public collateralStatus: object = [
    'unoccupied',

    ' Occupied by the debtor / debtors family',

    'Leased to other parties (with lease 2 years)',

    'Leased to other parties (with lease > 2 years)',
  ];

  public Cv: string;
  public collateralCoverage: object = ['Increase', 'Stable (±10% Change)', 'Decrease'];

  public Ca: string;
  public creditApplication: object = ['Yes', 'No'];

  public Ci: string;
  public collateralInsurance: object = [
    'Covered by partner insurance company',
    'Covered by non-partner insurance companies',
    'Not covered by insurance',
  ];

  ngOnInit(): void {
    if (this.item.attributes['cpRacBelow'].cpValueBot.length !== 0) {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValueBot.length; i++) {
        this.dataBelowChecklist = this.item.attributes['cpRacBelow'].cpValueBot;
        this.remarks[i] = this.item.attributes['cpRacBelow'].cpValueBot[i].remarks;
      }
    }
    // if (this.item.attributes['riksCriteria'].cpValueBot.length !== 0) {
    //   for (let i = 0; i < this.item.attributes['riksCriteria'].cpValueBot.length; i++) {
    //     this.remaks[i] = this.item.attributes['riksCriteria'].cpValueBot[i].remaks;
    //   }
    // }

    if (this.item.attributes['cpRacBelow'].cpValeuTwo.length !== 0) {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuTwo.length; i++) {
        this.dataBelowChecklistBot = this.item.attributes['cpRacBelow'].cpValeuTwo;
      }
    }

    if (this.item.attributes['cpRacBelow'].cpValeuThere.length !== 0) {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuThere.length; i++) {
        this.dataBelowChecklistBF = this.item.attributes['cpRacBelow'].cpValeuThere;
      }
    }

    if (this.item.attributes['cpRacBelow'].cpValeuFour.length !== 0) {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuFour.length; i++) {
        this.dataBelowChecklistCollateral = this.item.attributes['cpRacBelow'].cpValeuFour;
      }
    }

    if (this.item.attributes['cpRacBelow'].cpValeuFive.length !== 0) {
      for (let i = 0; i < this.item.attributes['cpRacBelow'].cpValeuFive.length; i++) {
        this.dataBelowChecklistExclusively = this.item.attributes['cpRacBelow'].cpValeuFive;
      }
    }
  }
}
