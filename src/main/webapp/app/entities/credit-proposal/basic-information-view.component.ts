import { Component, EventEmitter, SimpleChanges, Output, Input, OnChanges, OnInit } from '@angular/core';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent implements OnChanges {
  @Output() outputTeamReviewer = new EventEmitter();
  @Input() creditProposalItem: ICreditProposal;
  public dataCreditProposal: ICreditProposal;
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

  ngOnChanges(changes: SimpleChanges) {
    console.log('data changes', changes);
  }

  ngOnInit() {
    console.log('proposal item', this.creditProposalItem);
  }
}
// test