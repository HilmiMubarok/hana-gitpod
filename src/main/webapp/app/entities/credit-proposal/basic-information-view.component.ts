import { Component, EventEmitter, SimpleChanges, Output, Input, OnChanges } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent implements OnChanges {
  @Output() outputTeamReviewer = new EventEmitter();
  @Input() creditProposalItem: ICreditProposal;
  public dataCreditProposal: ICreditProposal = new CreditProposal();
  public item: ICreditProposal = new CreditProposal();
  public gridCreditProposal: any = [];
  public accountStatus: object = {
    watchList: false,
    restructured: false,
    relatedParty: false,
  };

  public watchlistDebtors: object = {
    isDebtorListedonWatchlistorResturing: '',
    areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory: '',
  };
  public remark: any = '';

  constructor() {
    this.item = new CreditProposal();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.accountStatus['watchList'] = JSON.parse(changes.creditProposalItem.currentValue.attributes.accountStatus).watchList;
    this.accountStatus['restructured'] = JSON.parse(changes.creditProposalItem.currentValue.attributes.accountStatus).restructured;
    this.accountStatus['relatedParty'] = JSON.parse(changes.creditProposalItem.currentValue.attributes.accountStatus).relatedParty;
    this.remark = changes.creditProposalItem.currentValue.attributes.remark;
    this.watchlistDebtors['isDebtorListedonWatchlistorResturing'] = JSON.parse(
      changes.creditProposalItem.currentValue.attributes.watchlistDebtors
    ).isDebtorListedonWatchlistorResturing;
    this.watchlistDebtors[
      'areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory'
    ] = JSON.parse(
      changes.creditProposalItem.currentValue.attributes.watchlistDebtors
    ).areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory;
  }

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
    // 'Image', 'FileManager']
  };

  save() {
    this.creditProposalItem.attributes = {
      accountStatus: JSON.stringify({
        watchList: this.accountStatus['watchList'] ? this.accountStatus['watchList'] : false,
        restructured: this.accountStatus['restructured'] ? this.accountStatus['restructured'] : false,
        relatedParty: this.accountStatus['relatedParty'] ? this.accountStatus['relatedParty'] : false,
      }),

      watchlistDebtors: JSON.stringify({
        isDebtorListedonWatchlistorResturing: this.watchlistDebtors['isDebtorListedonWatchlistorResturing']
          ? this.watchlistDebtors['isDebtorListedonWatchlistorResturing']
          : '',

        areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory: this
          .watchlistDebtors[
          'areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory'
        ]
          ? this.watchlistDebtors[
              'areTheClassificationBasedOnInternationalFinanceCorporationEnvironmentalAndSocialNotClassifiedAsHighRiskCategory'
            ]
          : '',
      }),

      remark: this.remark,
    };

    this.outputTeamReviewer.emit(this.creditProposalItem);
  }
}
