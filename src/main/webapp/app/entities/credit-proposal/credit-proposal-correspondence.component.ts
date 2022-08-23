import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmitType } from '@syncfusion/ej2-base';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ICreditProposal } from './credit-proposal.model';
import { CreditProposalService } from './credit-proposal.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityEj2GridComponent } from 'app/shared/base/abstract-entity-ej2-grid.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { HttpResponse } from '@angular/common/http';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';

@Component({
  selector: 'jhi-credit-proposal-correspondence',
  templateUrl: './credit-proposal-correspondence.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalCorrespondenceComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  public name?: string;
  public position?: string;
  public date?: string;
  public notes?: string;

  @ViewChild('ejDialog') ejDialog: DialogComponent;
  public dataDropdown: string[] = ['Manager', 'Developer', 'Bussines Analyst'];

  onOpen(args: any) {
    args.preventFocus = true;
  }

  onOpenDialog(event: any): void {
    this.ejDialog.show();
  }

  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  public onBeforeOpen = function (args: any): void {
    args.maxHeight = '700px';
  };

  public clearTextBox(): void {
    this.name = '';
    this.position = '';
    this.date = '';
    this.notes = '';
  }

  public addToGrid(ev: any): void {
    this.data = [
      ...this.data,
      {
        id: this.data.length + 1,
        name: this.name,
        position: this.position,
        date: this.date,
        notes: this.notes,
      },
    ];
    this.clearTextBox();
    this.ejDialog.hide();
    console.log(this.data);
  }

  public data: any = [
    { id: 1, name: 'John', position: 'Manager', date: '05/10/2017', notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];
}
