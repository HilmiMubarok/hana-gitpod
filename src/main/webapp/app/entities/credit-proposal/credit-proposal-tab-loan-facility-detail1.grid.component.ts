import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CreditProposal, ICreditProposal } from './credit-proposal.model';
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
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'jhi-credit-proposal-tab-loan-facility-detail1-grid',
  templateUrl: './credit-proposal-tab-loan-facility-detail1.grid.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabLoanFacilityDetail1GridComponent {
  public pageSettings: PageSettingsModel = { pageCount: 2, pageSize: 5 };
  public state: string;
  public dialogVisible: false;
  public itemfas: object[] = [
    {
      indexNum: '1',
      applicationTypeDescription: 'New',
      facilityType: 'KMK',
      subLimit: 'No',
      currency: 'IDR',
      initialLimit: '1',
      outstanding: '0',
      changes: '8500000',
      creditLimit: '8500000',
      interestRate: 'JIBOR 3 MONTH + 4 %',
      provision: '0.25%',
      tenor: '36',
      availableLimit: '0',
      maturityDate: '28/07/2022',
    },
    {
      indexNum: '2',
      applicationTypeDescription: 'New',
      facilityType: 'KMK',
      subLimit: 'No',
      currency: 'IDR',
      initialLimit: '2',
      outstanding: '2',
      changes: '7500000',
      creditLimit: '7500000',
      interestRate: 'JIBOR 3 MONTH + 4 %',
      provision: '0.25%',
      tenor: '36',
      availableLimit: '0',
      maturityDate: '28/07/2022',
    },
  ];
  //  constructor(
  //     private creditProposalService: CreditProposalService,

  //   ) {
  //     creditProposalService
  //   }
  //   ngOnInit(): void {
  //     this.creditProposalService.query().subscribe((res: HttpResponse<ICreditProposal[]>) => {
  //       this.itemfas = res.body
  //     })

  //   }

  public onEdit(data: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
  }

  public onDelete(data: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
  }
}
