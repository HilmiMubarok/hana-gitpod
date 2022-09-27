import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { CreditProposalProcessService } from 'app/entities/credit-proposal/credit-proposal-process.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { CreditProposalService } from 'app/entities/credit-proposal/credit-proposal.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'jhi-loan-analys-opinion',
  templateUrl: './loan-analys-opinion.component.html',
  styleUrls: ['./loan-analys-opinion.css'],
})
export class LoanAnalysOpinionComponent {
    @ViewChild('ejDialog') ejDialog: DialogComponent;
    public dialogVisible: boolean;
    public data : any [];
    public pageSettings : any;
    notes: any;
    private _creditProposalItem: ICreditProposal;

    @Input()
    get creditProposalItem() {
      return this._creditProposalItem;
    }

    set creditProposalItem(item: ICreditProposal) {
      this._creditProposalItem = item;
      console.log(this._creditProposalItem);
    }

  public onView(): void{
    this.ejDialog.show();
  }

    public onOverlayClick(): void {
      this.ejDialog.hide();
    }
    public tools: ToolbarModule = {
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
        'Outdent',
        'Indent',
        'SuperScript',
        'SubScript',
        'CreateLink',
      ],
    };
  }

