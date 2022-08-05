import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { EmitType } from '@syncfusion/ej2-base';

@Component({
  selector: 'jhi-credit-proposal-approval-tab-summary',
  templateUrl: './credit-proposal-approval-tab-summary.component.html',
  styleUrls: ['./credit-proposal-approval-summary.style.css'],
})
export class CreditProposalApprovalTabSummaryComponent implements OnInit {
  public showDialog = false;
  public position: object = { X: 'center', Y: 'top' };

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

  @ViewChild('ejDialog') ejDialog: DialogComponent;
  // Create element reference for dialog target element.
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  // The Dialog shows within the target element.
  public targetElement: HTMLElement;

  // To get all element of the dialog component after component get initialized.
  ngOnInit() {
    this.initilaizeTarget();
  }

  // Initialize the Dialog component's target element.
  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };

  // Hide the Dialog when click the footer button.
  public hideDialog: EmitType<object> = () => {
    this.ejDialog.hide();
  };

  // Enables the footer buttons
  public buttons: Object = [
    {
      click: this.hideDialog.bind(this),
      buttonModel: {
        content: 'Return to RM',
      },
    },
  ];

  // Sample level code to handle the button click action
  public onOpenDialog = (event: any): void => {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  };

  public fasilitasKredit: object[] = [
    {
      no: 1,
      facilityType: 'kmk-DemonLoan',
      subLimit: 'yes',
      ccy: 'IDR',
      initialLimit: 0,
      os: 0,
      change: '2.000.000',
      totalKredit: '8.900.0000',
      interestRate: '50%',
      provision: '0.25% p.a',
      adminPee: '0',
      tenor: '36 mont',
    },
  ];

  public generatedDocument: object[] = [
    {
      no: 1,
      fileName: 'Credit Proposal < 15 M (.PDF Format)',
      date: '02 Jun 2022',
      createBy: 'Budi Permana (RM)',
      sizeFile: '168 KB',
    },
  ];

  public opinionHistory: object[] = [
    {
      no: 1,
      riview: 'Suherman',
      position: 'Branch Manager',
      date: '02 Juni 2022',
      opini: 'OK',
    },
  ];
}
