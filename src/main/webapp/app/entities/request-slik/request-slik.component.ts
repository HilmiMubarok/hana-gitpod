import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IRequestSlik, requestSlikData } from './request-slik.model';
import { RequestSlikService } from './request-slik.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'jhi-request-slik',
  templateUrl: './request-slik.component.html',
  styleUrls: ['../credit-proposal/credit-proposal-list.css'],
})
export class RequestSlikComponent extends AbstractEntityComponent<IRequestSlik> {
  requestSliks$: Observable<any>;
  constructor(
    protected requestSlikService: RequestSlikService,
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
      requestSlikService,
      parseLinks,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.parentRoute = '/request-slik';
    this.listChangeEventName = 'requestSlikListModification';
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
    this.requestSliks$ = this.requestSlikService.getAll().pipe(map(res => res.body.data));
  }

  trackId(index: number, item: IRequestSlik) {
    return item.id;
  }

  get requestSliks() {
    return this.items;
  }

  set requestSliks(requestSlik: IRequestSlik[]) {
    this.items = requestSlik;
  }

  public previousState(): void {
    window.history.back();
  }

  public requestSlikStatusCodes: IOptionNode[] = [
    {
      id: 'DRAFT',
      label: 'Draft',
    },
    {
      id: 'APPROVAL_SLIK',
      label: 'Approval Slik',
    },
    {
      id: 'CHECKING_IN_PROGRESS',
      label: 'Checking In Progress',
    },
    {
      id: 'REJECT',
      label: 'Reject',
    },
    {
      id: 'COMPLETE',
      label: 'Complete',
    },
  ];

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.requestSlikStatusCodes, event.previousIndex, event.currentIndex);
  }

  public clickedChip: string;
  public chipClick(option: IOptionNode): void {
    this.page = 0;
    if (this.clickedChip === option.id) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
    } else {
      this.clickedChip = option.id;
    }
    this.loadAll();
  }
}
