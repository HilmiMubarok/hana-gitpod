import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { INotes } from 'app/entities/notes/notes.model';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';

@Component({
  selector: 'jhi-credit-proposal-dialog-opinion-history',
  templateUrl: './credit-proposal-dialog-opinion-history.component.html',
  styleUrls: ['../../css/credit-proposal-basic-information.css'],
})
export class CreditProposalDialogOpinionHistoryComponent {
  public notes: INotes;
  public creditProposalItem: ICreditProposal;

  public userId: string;
  public message: any;

  //   public test(){
  //     for (let i = 0; i < this.creditProposalItem.notes[0]['userId'].length; i++) {

  //       if (this.creditProposalItem.notes[i].userId === undefined ) {
  //         console.log('Masukkkk Coy')
  //       }else{
  //         this.userId = this.creditProposalItem.notes[i].userId ;
  //       //  this.message = this.creditProposalItem.notes[i].attributes['message'];
  //         console.log("INI NOTESS",   this.userId);
  //     }
  //   }
  // }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: INotes;
      creditProposalItem: ICreditProposal;
    },
    _dialog: MatDialogRef<CreditProposalDialogOpinionHistoryComponent>
  ) {
    this.notes = this.dataNotes.notes;
    this.creditProposalItem = this.dataNotes.creditProposalItem;
    // this.penampung = this.creditProposalItem.notes
    console.log('INI NOTESS', this.dataNotes.notes);
  }

  public _creditProposalItem: ICreditProposal;
}
