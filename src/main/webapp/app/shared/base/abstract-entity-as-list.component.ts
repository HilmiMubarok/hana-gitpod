import { OnInit, OnDestroy, Input, Component, Output, EventEmitter } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityService } from './abstract-entity.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({ template: '' })
export class AbstractEntityAsListComponent<T> implements OnInit, OnDestroy {
  @Input() canSearch: boolean;
  @Input() items: T[] = [];

  @Output() itemDelete: EventEmitter<T> = new EventEmitter<T>();
  @Output() itemSave: EventEmitter<T> = new EventEmitter<T>();

  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  protected currentAccount: Account;
  protected eventSubscriber: Subscription;
  protected links: any;
  protected previousPage: any;
  protected listChangeEventName: string;
  protected entityKeyName: string;

  public selectedItems: T[];
  public currentSearch: string;
  public totalItems: any;
  public first: number;
  public loading: boolean;
  public itemsPerPage: number;
  public page: number;
  public predicate: string;
  public reverse: string;
  public canAdd: boolean;

  constructor(
    protected itemService: AbstractEntityService<T>,
    protected parseLinks: ParseLinks,
    protected jhiAlertService: AlertService,
    protected accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService
  ) {
    this.canSearch = false;
    this.first = 0;
    this.page = 1;
    this.reverse = 'asc';
    this.currentSearch = '';
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.canAdd = true;
    // this.pagingKey = Math.random().toString(36);
  }

  protected loadAllFilterBy() {
    this.itemService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<T[]>) => this.paginateItems(res.body, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  loadAll() {
    this.loading = true;
    if (this.currentSearch) {
      this.itemService
        .search({
          page: this.page - 1,
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<T[]>) => this.paginateItems(res.body, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }
    this.loadAllFilterBy();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.loadAll();
  }

  search(query: any) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.loadAll();
  }

  protected initialize() {
    this.loadAll();
    this.registerChangeInItems();
  }

  protected destroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  ngOnInit() {
    this.initialize();
  }

  ngOnDestroy() {
    this.destroy();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.showFile(base64String, contentType);
  }

  registerChangeInItems() {
    this.eventSubscriber = this.eventManager.subscribe(this.listChangeEventName, response => this.loadAll());
  }

  sort() {
    const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
    if (this.predicate !== this.entityKeyName) {
      result.push(this.entityKeyName);
    }
    return result;
  }

  protected paginateItems(data: T[], headers: HttpHeaders) {
    this.loading = false;
    this.links = this.parseLinks.parse(headers.get('link'));
    this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
    this.items = data;
  }

  protected onError(errorMessage: string) {
    this.loading = false;
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
  }

  loadDataLazy(event: LazyLoadEvent) {
    this.itemsPerPage = event.rows;
    this.page = Math.ceil(event.first / this.itemsPerPage) + 1;

    if (event.sortField !== undefined) {
      this.predicate = event.sortField;
    }

    this.loadPage(this.page);
  }

  pageSizeChanged(event: any) {
    this.itemsPerPage = event.rows;
    this.page = Math.ceil(event.first / this.itemsPerPage) + 1;
    this.loadPage(this.page);
  }

  processEntity(id: any) {
    this.itemService.process({ idDocument: id }, { processName: 'processEntity' }).subscribe(r => {});
  }

  deleteItem(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.delete(id).subscribe(() => {
          this.messageService.add({ severity: 'warn', summary: 'Remove Data', detail: 'Remove data done...' });
          this.eventManager.broadcast({
            name: this.listChangeEventName,
            content: 'Completed an item',
          });
        });
      },
    });
  }
}
