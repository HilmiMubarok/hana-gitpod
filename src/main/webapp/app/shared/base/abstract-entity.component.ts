import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { AccountService } from 'app/core/auth/account.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityService } from './abstract-entity.service';
import { Account } from 'app/core/auth/account.model';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { map, takeUntil } from 'rxjs/operators';
import { BaseDataUtils } from './base-data-utils.service';

@Component({ template: '' })
export class AbstractEntityComponent<T> implements OnInit, OnDestroy {
  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  protected currentAccount: Account;
  protected eventSubscriber: Subscription;
  protected links: any;
  protected previousPage: any;
  protected reverse: any;
  protected routeData: any;

  public items: T[];
  public selectedItems: T[];
  public currentSearch: string;
  public totalItems: any;
  public itemsPerPage: number;
  public rowsPerPage: number[];
  public page: number;
  public predicate: string;
  public first: number;
  public loading: boolean;

  protected parentRoute: string;
  protected listChangeEventName: string;
  protected entityKeyName: string;

  constructor(
    protected itemService: AbstractEntityService<T>,
    protected parseLinks?: ParseLinks,
    protected accountService?: AccountService,
    protected activatedRoute?: ActivatedRoute,
    protected dataUtils?: BaseDataUtils,
    protected router?: Router,
    protected eventManager?: EventManager,
    protected messageService?: MessageService,
    protected confirmationService?: ConfirmationService
  ) {
    this.rowsPerPage = [5, 10, 20, 50];
    this.itemsPerPage = 20;
    this.first = 0;
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
        .pipe(map((res: HttpResponse<T[]>) => this.preLoad(res)))
        .subscribe({
          next: (res: HttpResponse<T[]>) => this.paginateItems(res.body, res.headers),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }
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

  preLoad(res: HttpResponse<T[]>): HttpResponse<T[]> {
    res.body.forEach(item => {});
    return res;
  }

  loadPage(page: number, force?: boolean) {
    if (page !== this.previousPage || force) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.router.navigate([this.parentRoute], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        search: this.currentSearch,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    });
    this.loadAll();
  }

  clear() {
    this.page = 0;
    this.currentSearch = '';
    this.router.navigate([
      this.parentRoute,
      {
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    ]);
    this.loadAll();
  }

  search(query: string) {
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.router.navigate([
      this.parentRoute,
      {
        search: this.currentSearch,
        page: this.page,
        sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc'),
      },
    ]);
    this.loadAll();
  }

  protected initialize() {}

  protected destroy() {}

  ngOnInit() {
    this.initialize();
    this.eventSubscriber = this.eventManager.subscribe(this.listChangeEventName, () => this.loadAll());
    this.loadAll();

    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
    this.destroy();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  sort() {
    if (this.currentSearch) {
      return [];
    }
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
    if (event.sortField !== undefined) {
      this.predicate = event.sortField;
      this.reverse = event.sortOrder;
    }
    this.first = event.first;
    this.itemsPerPage = event.rows;
    this.page = Math.ceil(event.first / event.rows) + 1;
    this.loadPage(this.page);
  }

  pageSizeChanged(event: any) {
    this.first = event.first;
    this.itemsPerPage = event.rows;
    this.page = Math.ceil(event.first / event.rows) + 1;
    this.transition();
  }

  processEntity(id: any) {
    this.itemService.process({ idDocument: id }, { processName: 'processEntity' }).subscribe(r => {});
  }

  rebuildIndex() {
    this.itemService.process({}, { processName: 'initializeIndex' }).subscribe(r => {
      this.messageService.add({
        severity: 'info',
        summary: 'Rebuild Index',
        detail: 'Rebuild Index Queue, wait until background process done .......',
      });
    });
  }

  deleteItem(id: any) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to remove ?',
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

  queryParams(): any {
    return {};
  }

  badge(statusCode: string): string {
    if (statusCode === '_NA_') {
      return 'badge rounded-pill bg-danger';
    } else if (statusCode === 'CREATED') {
      return 'badge rounded-pill bg-primary';
    } else if (statusCode === 'ACTIVATED' || statusCode === 'PROCESSING') {
      return 'badge rounded-pill bg-secondary';
    } else if (statusCode === 'APPROVED') {
      return 'badge rounded-pill bg-success';
    } else if (statusCode === 'REJECTED') {
      return 'badge rounded-pill bg-warning';
    } else if (statusCode === 'HOLD') {
      return 'badge rounded-pill bg-warning';
    } else if (statusCode === 'SHIPPED') {
      return 'badge rounded-pill bg-info';
    } else if (statusCode === 'SENT') {
      return 'badge rounded-pill bg-info';
    } else if (statusCode === 'RECEIVED') {
      return 'badge rounded-pill bg-light';
    } else if (statusCode === 'CANCELLED') {
      return 'badge rounded-pill bg-dark';
    } else if (statusCode === 'DISABLED') {
      return 'badge rounded-pill bg-dark';
    } else if (statusCode === 'ENABLED') {
      return 'badge rounded-pill bg-success';
    }
    return 'badge rounded-pill bg-info';
  }
}
