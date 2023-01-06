import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-collateral-info-remarks-history',
  templateUrl: './credit-proposal-collateral-info-remarks.component.html',
  styleUrls: ['../checklist/credit-proposal-collateral-info-checklist.css'],
})
export class CollateralInfoRemarksHistoryComponent implements OnInit {
  public _creditProposal: ICreditProposal;
  public remarks: string;
  public newMessage: string;
  // public pacth: any;
  // public view: boolean;

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {}

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.removeTagRemaks();
    // this.pathremove();
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
  };

  // public pathremove() {
  //   this.pacth = this.router.url.split('/')[1];
  //   if (this.pacth === 'la-approval' || this.pacth === 'cp-status-approval') {
  //     this.view = true;
  //   }

  //   console.log('test', this.pacth);
  // }

  removeTagRemaks() {
    this.newMessage = this.creditProposal.attributes['collateralChecklist'].remarks;
    this.newMessage = this.newMessage.replace(/<(.|\n)*?>/g, '');
  }
}
