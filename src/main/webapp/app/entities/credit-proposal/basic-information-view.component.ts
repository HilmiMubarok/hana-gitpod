import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { ICreditProposal, CreditProposal } from './credit-proposal.model';

import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CreditProposalService } from './credit-proposal.service';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { CollateralService } from '../collateral/collateral.service';
import { HttpResponse } from '@angular/common/http';
import { ICollateral } from '../collateral/collateral.model';
import { IPerson } from '../person/person.model';
import { ICustomer } from '../customer/customer.model';
import { CifService } from '../cif/cif.service';
import { ICif } from '../cif/cif.model';

@Component({
  selector: 'jhi-credit-proposal-basic-information',
  templateUrl: './basic-information-view.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
})
export class ProposalBasicInformationViewComponent extends AbstractEntityComponent<ICreditProposal> implements OnInit {
  constructor(
    protected cifService: CifService,
    protected collateralService: CollateralService,
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
    super(cifService, parseLinks, accountService, activatedRoute, dataUtils, router, eventManager, messageService, confirmationService);

    // this.item = new CreditProposal();

    this.parentRoute = '/credit-proposal';
    this.listChangeEventName = 'creditProposalBasicViewModification';
    this.entityKeyName = 'id';

    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
      activatedRoute.queryParams.subscribe(params => {
        this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
        this.first = (this.page - 1) * this.itemsPerPage || 0;
      });
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
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
  // public personRMName: string;
  // public itemCollateral: ICollateral;
  // public itemCollateralid: number;
  // public creditProposal = new CreditProposal();

  // public customer: ICustomer;

  // public person: IPerson;

  public dataCreditProposal: ICreditProposal;
  public itemBookingBranch: string;
  public itemNoCif: string;
  public itemPerson: IPerson;
  public cifData: any = [];
  public customerType: any;

  save(): void {
    // cara membuat banding di dalam object
    // this.creditProposal.contact = this.person;
    //   this.personRMName = this.person.personalIdNumber;
    // cara untuk find id by param
  }
  ngOnInit() {
    // this.person.personalIdNumber = this.creditProposal.contact.personalIdNumber;
    // this.item.customer.booking_branch = this.customer.booking_branch;

    this.creditProposalService.find(this.activatedRoute.snapshot.paramMap.get('id')).subscribe((res: HttpResponse<ICreditProposal>) => {
      console.log('data credit', res.body);
      // this.itemCollateralid = res.body.id
      this.itemBookingBranch = res.body.cif.bookingBranch;
      this.itemNoCif = res.body.cif.customerId;
      this.itemPerson = res.body.prospectPerson;
      this.cifData.push(res.body);
      this.cifData[0].address1 = res.body.addresses[0].address.address1;
      this.customerType = res.body.partyTypeId;
    });

    console.log('cif data', this.cifData);
  }
}
