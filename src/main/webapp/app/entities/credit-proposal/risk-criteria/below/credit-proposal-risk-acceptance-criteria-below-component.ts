import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CreditProposal, ICreditProposal } from '../../credit-proposal.model';
import { PositionService } from '../../../position/position.service';
import { CreditProposalService } from '../../credit-proposal.service';
import { RisksAcceptenceCriteria } from '../risk-criteria.model';

@Component({
  selector: 'jhi-credit-proposal-risk-acceptance-criteria-below',
  templateUrl: './credit-proposal-risk-acceptance-criteria-below-component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalRiskAcceptanceCriteriaBelowComponent implements OnInit {
  attributes: any;
  public parameterBelow: string;
  public value: string;

  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService) {}

  public _item: ICreditProposal;

  @Input()
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
  }

  // for grid top
  public dataBelowChecklist = [
    {
      No: 1,
      parameterBelow: 'Debitur merupakan individu (perorangan), Warga Negara Indonesia (WNI) dan berdomisili di Indonesia?',
      value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Umur untuk debitur perorangan: Min. 24 tahun saat pengajuan, Max. 65 tahun pada saat jatem kredit',
      value: 'Yes',
    },
    {
      No: 3,
      parameterBelow: 'Lokasi usaha ≤ 30 KM dari booking unit cabang Hana Bank',
      value: 'Yes',
    },
    {
      No: 4,
      parameterBelow: 'Apakah industri debitur termasuk dalam watch list industry?',
      value: 'Yes',
    },
    {
      No: 5,
      parameterBelow: 'Tidak termasuk dalam Daftar Hitam Nasional (DHN) Bank Indonesia',
      value: 'Yes',
    },
    {
      No: 6,
      parameterBelow: 'Tujuan pengajuan kredit bukan untuk pembelian tanah',
      value: 'Yes',
    },
    {
      No: 7,
      parameterBelow: 'Bukan merupakan Political Exposed Person (PEP) -> termasuk pasangan kawin, BOD & BOC debitur',
      value: 'Yes',
    },
    {
      No: 8,
      parameterBelow:
        'Apakah debitur / pemegang saham / manajemen / guarantor tidak memiliki permasalahan pajak dan tidak memiliki info negatif lainnya? (Hukum, kriminal, sengketa dengan pihak lainnya, dsb.) Mohon juga dilakukan pengecekan melalui google.',
      value: 'Yes',
    },
    {
      No: 9,
      parameterBelow: 'Debitur tidak memiliki obligor di Bank KEB Hana Indonesia*)',
      value: 'Yes',
    },
  ];

  public onSelect(value: string, data: any): void {
    console.log({
      value,
      data,
    });
    // this.dataBelowChecklist[data.No - 1].value = value;
    // this._creditProposal.attributes['cpRacBelow'].checklistvalueBelow = this.dataBelowChecklist;
    this.dataBelowChecklist[data.No - 1].value = value;
    this.item.attributes['riksCriteria'].cpValueBot = this.dataBelowChecklist;
    // checklistValue adlah model
    // dataChecklist data object
    console.log('konsol', this.item.attributes['riksCriteria']);
  }

  // for grid bot
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
        'Verify the location of the debtors house / business owner where the house is in accordance with (reflecting) the financial data provided, the community and the number of debtor credit applications.',
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

  public dataBelowChecklistCollateral = [
    {
      No: 1,
      parameterBelow: 'Collateral on behalf of: Debtor / Married partner / parents / shareholder / married partner shareholder',
      Value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Not included in the Negative List Collateral',
      Value: 'Yes',
    },
    {
      No: 3,
      parameterBelow: 'Located in a city / residential / industrial area / commercial area with good / fair marketability.',
      Value: 'Yes',
    },
    {
      No: 4,
      parameterBelow:
        'Guarantee status: SHGB / SHM / SHMSRS and certificate maturity 2 years upon maturity of IL / WCI and 5 years for DL / OD.',
      Value: 'Yes',
    },
    {
      No: 5,
      parameterBelow: 'The age of the security owner is 65 years and the security owner is the debtor / spouse / parent or shareholder.',
      Value: 'Yes',
    },
  ];

  public dataBelowChecklistExclusively = [
    {
      No: 1,
      parameterBelow: 'Debtors have deposits / CASA at KEB Hana Bank',
      Value: 'Yes',
    },
    {
      No: 2,
      parameterBelow: 'Account activity at KEB Hana Bank',
      Value: 'Yes',
    },
    {
      No: 3,
      parameterBelow: 'Been a debtor 3 years',
      Value: 'Yes',
    },
    {
      No: 4,
      parameterBelow: 'Total loan exposure (incl. other banks) equals or decreases',
      Value: 'Yes',
    },
  ];

  // for function LOV
  public collateralStatus: string[] = [
    'unoccupied',
    '        Occupied by the debtor / debtors family',
    'Leased to other parties (with lease 2 years)',
    'Leased to other parties (with lease > 2 years)',
  ];

  public collateralCoverage: string[] = ['Increase', 'Stable (±10% Change)', 'Decrease'];

  public creditApplication: string[] = ['Yes', 'No'];

  public collateralInsurance: string[] = [
    'Covered by partner insurance company',
    'Covered by non-partner insurance companies',
    'Not covered by insurance',
  ];

  ngOnInit(): void {
    if (this.item.attributes['riksCriteria'].cpValueBot.length !== 0) {
      for (let i = 0; i < this.item.attributes['riksCriteria'].cpValueBot.length; i++) {
        this.dataBelowChecklist = this.item.attributes['riksCriteria'].cpValueBot;
      }
    }
    // if (this.item.attributes['creditProposalRiskAcceptanceCriteriaBelow'].checklistValueBelow.length === 0) {
    //   this.dataBelowChecklist = this.dataBelowChecklist;
    // } else {
    //   this.dataBelowChecklist = this.item.attributes['creditProposalRiskAcceptanceCriteriaBelow'].checklistValueBelow;
    //   this.dataBelowChecklist = this.item.attributes['creditProposalRiskAcceptanceCriteriaBelow'].checklistValueBelow;
    // }
  }
}
