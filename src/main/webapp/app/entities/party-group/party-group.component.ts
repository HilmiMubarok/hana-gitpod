import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IPartyGroup, PartyGroup } from './party-group.model';
import { PartyGroupService } from './party-group.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-party-group',
  templateUrl: './party-group.component.html',
  styleUrls: ['./party-group-view.css'],
})
export class PartyGroupComponent extends AbstractEntityComponent<IPartyGroup> {
  public partyGroupModel: IPartyGroup = new PartyGroup();
  constructor(
    protected partyGroupService: PartyGroupService,
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
      partyGroupService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.item = new PartyGroup();

    this.parentRoute = '/party-group';
    this.listChangeEventName = 'partyGroupListModification';
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

  trackId(index: number, item: IPartyGroup) {
    return item.id;
  }

  get partyGroups() {
    return this.items;
  }

  set partyGroups(partyGroup: IPartyGroup[]) {
    this.items = partyGroup;
  }
  public data: string[] = ['Snooker', 'Tennis', 'Cricket', 'Football', 'Rugby'];

  saveData() {
    console.log(this.item);
    // this.partyGroupService.preSave(this.partyGroupModel);
  }
}
