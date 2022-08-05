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
import { PageSettingsModel, DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';

import { Observable, of } from 'rxjs';

@Component({ template: '' })
export class AbstractEntityEj2GridComponent<T> implements OnInit, OnDestroy {
  protected destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  protected currentAccount: Account;
  protected eventSubscriber: Subscription;
  protected links: any;
  protected previousPage: any;
  protected reverse: any;
  protected routeData: any;

  public pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 2, pageSize: 5 };
  public selectedItems: T[];
  public currentSearch: string;
  public totalItems: any;
  public itemsPerPage: number;
  public rowsPerPage: number[];
  public page: number;
  public predicate: string;
  public first: number;
  public loading: boolean;
  public initialState: DataStateChangeEventArgs = { skip: 0, take: 5 };

  protected parentRoute: string;
  protected listChangeEventName: string;
  protected entityKeyName: string;

  public items: Observable<{
    result: any[];
    count: number;
  }>;

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
    this.itemsPerPage = 5;
    this.first = 0;
  }

  loadAll(state: DataStateChangeEventArgs) {
    this.loading = true;

    this.page = state.skip === 0 ? 0 : state.skip / state.take;
    this.initialState = { skip: state.skip, take: state.take };

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
          next: (res: HttpResponse<T[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
          error: (res: HttpErrorResponse) => this.onError(res.message),
        });
      return;
    }

    this.itemService
      .query({
        page: this.page,
        size: state.take,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<T[]>) => this.paginateEjGridItems(res.body, res.headers, this.initialState),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  protected paginateEjGridItems(data: T[], headers: HttpHeaders, state: DataStateChangeEventArgs) {
    const passData = {
      result: [],
      count: 0,
    };

    this.loading = false;
    this.pageSettings.pageSize = parseInt(headers.get('X-Total-Count'), 10);

    if (this.page === 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['indexNum'] = i + 1;
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i]['indexNum'] = this.page * state.take + (i + 1);
      }
    }

    passData.result = data;
    passData.count = parseInt(headers.get('X-Total-Count'), 10);
    this.items = of(passData);
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
    this.loadAll(this.initialState);
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
    this.loadAll(this.initialState);
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
    this.loadAll(this.initialState);
  }

  protected initialize() {}

  protected destroy() {}

  dataStateChange(state: DataStateChangeEventArgs): void {
    this.loadAll(state);
  }

  ngOnInit() {
    this.initialize();
    this.eventSubscriber = this.eventManager.subscribe(this.listChangeEventName, () => this.loadAll(this.initialState));
    this.loadAll(this.initialState);

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
