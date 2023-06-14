import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { IRequestSlik } from './request-slik.model';
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
import { finalize, Observable } from 'rxjs';
import { PartyCifService } from '../party-cif/party-cif.service';

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
    protected confirmationService: ConfirmationService,
    protected partyCifService: PartyCifService
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

    // this.routeData = this.activatedRoute.data.subscribe(data => {
    //   this.page = data.pagingParams.page;
    //   this.previousPage = data.pagingParams.page;
    //   this.reverse = data.pagingParams.ascending;
    //   this.predicate = data.pagingParams.predicate;
    //   activatedRoute.queryParams.subscribe(params => {
    //     this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
    //     this.first = (this.page - 1) * this.itemsPerPage || 0;
    //   });
    //   console.log('data', {
    //     data,
    //     first: this.first,
    //   });
    // });
    // this.currentSearch =
    //   this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
    this.requestSliks$ = this.requestSlikService.getData().pipe(finalize(() => (this.isLoading = false)));
    this.getStatus();
  }

  isLoading: Boolean = true;

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

  public requestSlikStatusCodes: IOptionNode[] = [];

  getStatus() {
    this.requestSlikService.getStatuses().subscribe(res => (this.requestSlikStatusCodes = res));
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.requestSlikStatusCodes, event.previousIndex, event.currentIndex);
  }

  searchCif: number;
  searchByCif(cif) {
    this.isLoading = true;
    this.requestSliks$ = !cif
      ? this.requestSlikService.getData().pipe(finalize(() => (this.isLoading = false)))
      : this.requestSlikService.searchByCif(cif).pipe(finalize(() => (this.isLoading = false)));
  }

  public clickedChip;
  trackByFn(index, item) {
    return item.id; // or any other unique identifier
  }

  public chipClick(option): void {
    console.log(option);
    // this.page = 0;
    if (this.clickedChip === option) {
      document.getElementById('statusOption').style.backgroundColor = 'whitesmoke';
      this.clickedChip = '';
      // this.loadAll();
      this.isLoading = true;
      this.requestSliks$ = this.requestSlikService.getData().pipe(finalize(() => (this.isLoading = false)));
    } else {
      this.clickedChip = option;
      this.isLoading = true;
      this.requestSliks$ = this.requestSlikService.searchByStatus(option).pipe(finalize(() => (this.isLoading = false)));
      // this.requestSlikService.searchByStatus(option.id).subscribe(res => console.log(res));
    }
  }
}
