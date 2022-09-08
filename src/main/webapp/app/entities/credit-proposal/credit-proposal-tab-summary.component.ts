import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
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

@Component({
  selector: 'jhi-credit-proposal-tab-summary',
  templateUrl: './credit-proposal-tab-summary.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class CreditProposalTabSummaryComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  public state: string;
  public dialogVisible: false;
  public data: object[];
  public FileTemplate: string;

  public _item?: ICreditProposal = new CreditProposal();
  // public itemAtt : any;
  public strength?: string;
  public opportunities?: string;
  public weaknesses?: string;
  public threats?: string;

  @Input('item')
  get item() {
    return this._item;
  }

  set item(item: any) {
    this._item = item;
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

  attributes: any;

  constructor(
    protected creditProposalService: CreditProposalService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected modalService: NgbModal,
    protected confirmationService: ConfirmationService
  ) {
    super(
      creditProposalService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );
    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalListModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = false;
      this.predicate = 'createdDate';
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  save(): void {
    this.creditProposalService.create(this.item).subscribe(res => {
      console.log('cek', res);
    });

    console.log('log', this.item);
  }

  public generate(data: any): void {
    this.state = 'idle';
    this.dialogVisible = false;
  }
}
//   @ViewChild('findCifDialog')
//   public findCifDialog: DialogComponent;

//   public cifNumber: string;
//   public visiblePrompt: Boolean = false;
//   public animationSettings: AnimationSettingsModel = {
//     effect: 'Zoom',
//   };

//   constructor(
//     protected creditProposalService: CreditProposalService,
//     protected parseLinks: ParseLinks,
//     protected alertService: AlertService,
//     public accountService: AccountService,
//     protected activatedRoute: ActivatedRoute,
//     protected dataUtils: BaseDataUtils,
//     protected router: Router,
//     protected eventManager: EventManager,
//     protected messageService: MessageService,
//     protected modalService: NgbModal,
//     protected confirmationService: ConfirmationService
//   ) {
//     super(
//       creditProposalService,
//       parseLinks,
//       accountService,
//       activatedRoute,
//       dataUtils,
//       router,
//       eventManager,
//       messageService,
//       confirmationService
//     );

//     this.parentRoute = '/credit-proposal';
//     this.listChangeEventName = 'creditProposalListModification';
//     this.entityKeyName = 'id';

//     this.routeData = this.activatedRoute.data.subscribe(data => {
//       this.page = data.pagingParams.page;
//       this.previousPage = data.pagingParams.page;
//       this.reverse = false;
//       this.predicate = 'createdDate';
//       activatedRoute.queryParams.subscribe(params => {
//         this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
//         this.first = (this.page - 1) * this.itemsPerPage || 0;
//       });
//     });
//     this.currentSearch =
//       this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
//   }

//   get creditProposals() {
//     return this.items['result'];
//   }

//   set creditProposals(creditProposal: ICreditProposal[]) {
//     this.items['result'] = creditProposal;
//   }

//   public openPromptFindCIF(): void {
//     this.findCifDialog.show();
//   }

//   public hidePromptFindCIF(): void {
//     this.findCifDialog.hide();
//   }

//   public buttonFindCifDialog = [
//     {
//       click: this.hidePromptFindCIF.bind(this),
//       buttonModel: {
//         content: 'Close',
//       },
//     },
//   ];

//   public findCif(): void {
//     this.creditProposalService.findByCif(this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
//       const result: ICreditProposal = res.body;
//       if (result) {
//         const redirectUri = '/credit-proposal/' + result[0].id + '/edit';
//         this.router.navigate([redirectUri]);
//       }
//     });
//   }
// }
