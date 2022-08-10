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
import { AccordionComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-credit-proposal',
  templateUrl: './credit-proposal-tab-exposure.component.html',
  styleUrls: ['../layout-css/layout-css-template.css'],
})
export class CreditProposalTabExposureComponent extends AbstractEntityEj2GridComponent<ICreditProposal> {
  @ViewChild('findCifDialog')
  public findCifDialog: DialogComponent;

  public cifNumber: string;
  public visiblePrompt: Boolean = false;
  public animationSettings: AnimationSettingsModel = {
    effect: 'Zoom',
  };

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

  get creditProposals() {
    return this.items['result'];
  }

  set creditProposals(creditProposal: ICreditProposal[]) {
    this.items['result'] = creditProposal;
  }

  public openPromptFindCIF(): void {
    this.findCifDialog.show();
  }

  public hidePromptFindCIF(): void {
    this.findCifDialog.hide();
  }

  public buttonFindCifDialog = [
    {
      click: this.hidePromptFindCIF.bind(this),
      buttonModel: {
        content: 'Close',
      },
    },
  ];

  public data: any = [
    {
      indexNum: 1,
      applicationNumber: '1',
      cifnumber: '79',
      InitialLimit: '1000',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'michael',
    },
    {
      indexNum: 2,
      applicationNumber: '2',
      cifnumber: '70',
      InitialLimit: '3500',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: '1500',
      frist: '15',
      Maturity: '5200',
      namegroup: 'hartono',
    },
    {
      indexNum: 3,
      applicationNumber: '3',
      cifnumber: '79',
      InitialLimit: '1500',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'obet',
    },
    {
      indexNum: 4,
      applicationNumber: '4',
      cifnumber: '79',
      InitialLimit: '2000',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'abet',
    },
    {
      indexNum: 5,
      applicationNumber: '5',
      cifnumber: '79',
      InitialLimit: '2500',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'helmi',
    },
    {
      indexNum: 6,
      applicationNumber: '6',
      cifnumber: '79',
      InitialLimit: '4300',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'andi',
    },
    {
      indexNum: 7,
      applicationNumber: '7',
      cifnumber: '79',
      InitialLimit: '1200',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'randi',
    },
    {
      indexNum: 8,
      applicationNumber: '8',
      cifnumber: '79',
      InitialLimit: '1800',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'inan',
    },
    {
      indexNum: 9,
      applicationNumber: '9',
      cifnumber: '79',
      InitialLimit: '1500',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'setya',
    },
    {
      indexNum: 10,
      applicationNumber: '10',
      cifnumber: '79',
      InitialLimit: '1600',
      Change: '1500',
      OS: '1000',
      credit: '1000',
      interet: '2022',
      Providion: 'blabla',
      admin: 'coba',
      frist: '10bln',
      Maturity: 'coba',
      namegroup: 'anjar',
    },
  ];

  public findCif(): void {
    this.creditProposalService.findByCif(this.cifNumber).subscribe((res: HttpResponse<ICreditProposal>) => {
      const result: ICreditProposal = res.body;
      if (result) {
        const redirectUri = '/credit-proposal/' + result[0].id + '/edit';
        this.router.navigate([redirectUri]);
      }
    });
  }
}
