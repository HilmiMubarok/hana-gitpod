import { Component, Input, OnInit } from '@angular/core';
import { PositionService } from 'app/entities/position/position.service';
import { CreditProposalService } from '../../credit-proposal.service';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-collateral-info-checklist',
  templateUrl: './credit-proposal-collateral-info-checklist.component.html',
  styleUrls: ['./credit-proposal-collateral-info-checklist.css'],
})
export class CreditProposalCollateralInfoChecklistComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  attributes: any;
  public criteria: string;
  public value: string;
  public remarks: string;

  constructor(protected creditProposalService: CreditProposalService, protected positionService: PositionService) {}

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  public onSelect(value: string, data: any): void {
    this.dataChecklist[data.No - 1].value = value;
    this.creditProposal.attributes['collateralChecklist'].checklistValue = this.dataChecklist;
    // checklistValue adlah model
    // dataChecklist data object
  }

  btnSave($event: any): void {
    this.creditProposal.attributes['collateralChecklist'].checklistValue = [
      ...this.creditProposal.attributes['collateralChecklist'].checklistValue,
      {
        criteria: this.criteria,
      },
    ];
  }

  ngOnInit(): void {
    if (this.creditProposal.attributes['collateralChecklist'].checklistValue.length !== 0) {
      for (let i = 0; i < this.creditProposal.attributes['collateralChecklist'].checklistValue.length; i++) {
        this.dataChecklist = this.creditProposal.attributes['collateralChecklist'].checklistValue;
      }
    }
  }

  public dataChecklist = [
    {
      No: 1,
      criteria: 'Is the Collateral being leased?',
      value: 'No',
    },
    {
      No: 2,
      criteria: 'If yes, is the lease agreement submitted? How Long is the tenor & when is the maturity date?',
      value: 'No',
    },
    {
      No: 3,
      criteria:
        'Is collateral still PPJB(Commitment of Sale and Purchase)?If Yes, When will AJB (notary deed of sales and purchase) be done? and when was the PPJB made?',
      value: 'No',
    },
    {
      No: 4,
      criteria:
        'Is collateral HPL (right usage over land)?If Certificate still HPL on behalf of government, is there any permit documentation from government?',
      value: 'No',
    },
    {
      No: 5,
      criteria: 'Isadue date of SHGB(building right title) as collateral less than 2 years?',
      value: 'No',
    },
    {
      No: 6,
      criteria: 'Is Collateralmarketable and not hard to sell? (based on Internal Appraisal’s Opinion)',
      value: 'No',
    },
    {
      No: 7,
      criteria:
        'Will there be decrease in the value of collateral compared to previous appraisal report?(If difference > 10%, please explain)',
      value: 'No',
    },
    {
      No: 8,
      criteria: 'Is collateral not on behalf of the third party’s name?(other than a spouse/ wife/ parents/ Debtor’s child/ Share holder)',
      value: 'No',
    },
    {
      No: 9,
      criteria: 'IIs the duedate of SHGB as acollateral more than 2 years?',
      value: 'No',
    },
    {
      No: 10,
      criteria: 'Other Criteria',
      value: 'No',
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
