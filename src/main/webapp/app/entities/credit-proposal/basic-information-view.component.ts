import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent {
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
}
