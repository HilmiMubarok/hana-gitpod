import { Component, OnInit, ViewChild } from '@angular/core';
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

import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './credit-proposal-tab-management-info.component.html',
  styleUrls: ['./credit-proposal-tab-management-info.css'],
})
export class CreditProposaTabManagementInfoComponent extends AbstractEntityEj2GridComponent<ICreditProposal> implements OnInit {
  // @ViewChild('grid') public grid: GridComponent;
  // @ViewChild('findCifDialog')
  public data1: Object = [];

  ngOnInit(): void {
    this.data1 = data1;
    console.log(this.data1);
  }

  // public findCifDialog: DialogComponent;

  // public cifNumber: string;
  // public visiblePrompt: Boolean = false;
  // public animationSettings: AnimationSettingsModel = {
  //   effect: 'Zoom',
  // };

  // constructor(
  //   protected creditProposalService: CreditProposalService,
  //   protected parseLinks: ParseLinks,
  //   protected alertService: AlertService,
  //   public accountService: AccountService,
  //   protected activatedRoute: ActivatedRoute,
  //   protected dataUtils: BaseDataUtils,
  //   protected router: Router,
  //   protected eventManager: EventManager,
  //   protected messageService: MessageService,
  //   protected modalService: NgbModal,
  //   protected confirmationService: ConfirmationService
  // ) {
  //   super(
  //     creditProposalService,
  //     parseLinks,
  //     accountService,
  //     activatedRoute,
  //     dataUtils,
  //     router,
  //     eventManager,
  //     messageService,
  //     confirmationService
  //   );

  //   this.parentRoute = '/credit-proposal';
  //   this.listChangeEventName = 'creditProposalListModification';
  //   this.entityKeyName = 'id';

  //   this.routeData = this.activatedRoute.data.subscribe(data => {
  //     this.page = data.pagingParams.page;
  //     this.previousPage = data.pagingParams.page;
  //     this.reverse = false;
  //     this.predicate = 'createdDate';
  //     activatedRoute.queryParams.subscribe(params => {
  //       this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
  //       this.first = (this.page - 1) * this.itemsPerPage || 0;
  //     });
  //   });
  //   this.currentSearch =
  //     this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  // }

  // get creditProposals() {
  //   return this.items['result'];
  // }

  // set creditProposals(creditProposal: ICreditProposal[]) {
  //   this.items['result'] = creditProposal;
  // }

  // public openPromptFindCIF(): void {
  //   this.findCifDialog.show();
  // }

  // public hidePromptFindCIF(): void {
  //   this.findCifDialog.hide();
  // }

  // public buttonFindCifDialog = [
  //   {
  //     click: this.hidePromptFindCIF.bind(this),
  //     buttonModel: {
  //       content: 'Close',
  //     },
  //   },
  // ];

  // public findCif(): void {
  //   this.creditProposalService.findByCif(this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
  //     const result: ICreditProposal = res.body;
  //     if (result) {
  //       const redirectUri = '/credit-proposal/' + result[0].id + '/edit';
  //       this.router.navigate([redirectUri]);
  //     }
  //   });
  // }
}

export const data1: Object[] = [
  {
    no: '1',
    shareholder: 'shareholder',
    kepemilikan: 'kepemilikan',
    title: 'title',
    relationship: 'relationship',
    cif: 'cif',
    nik: '1218152505950002',
    npwp: 'npwp',
    date: '22-06-2001/ 26-06-1997',
    age: '22 Tahun',
    join: '21-05-2022',
  },
  {
    no: '2',
    shareholder: 'shareholder',
    kepemilikan: 'Tetap',
    title: 'title',
    relationship: 'relationship',
    cif: '000000',
    nik: '1218152505950002',
    npwp: 'npwp',
    date: '22-06-2005/ 26-06-1987',
    age: '32 Tahun',
    join: '21-05-2022',
  },
  {
    no: '2',
    shareholder: 'shareholder',
    kepemilikan: 'Tetap',
    title: 'title',
    relationship: 'relationship',
    cif: '000000',
    nik: '1218152505950002',
    npwp: 'npwp',
    date: '22-06-2005/ 26-06-1987',
    age: '32 Tahun',
    join: '21-05-2022',
  },
  {
    no: '2',
    shareholder: 'shareholder',
    kepemilikan: 'Tetap',
    title: 'title',
    relationship: 'relationship',
    cif: '000000',
    nik: '1218152505950002',
    npwp: 'npwp',
    date: '22-06-2005/ 26-06-1987',
    age: '32 Tahun',
    join: '21-05-2022',
  },
];
