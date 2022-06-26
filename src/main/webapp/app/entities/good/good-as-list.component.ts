import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { IGood } from './good.model';
import { GoodService } from './good.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityAsListComponent } from 'app/shared/base/abstract-entity-as-list.component';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';

@Component({
  selector: 'jhi-good-as-list',
  templateUrl: './good-as-list.component.html',
})
export class GoodAsListComponent extends AbstractEntityAsListComponent<IGood> implements OnChanges {
  @Input() filterName: string;
  @Input() idProductType: any;
  @Input() idConfig: any;

  constructor(
    protected goodService: GoodService,
    protected parseLinks: ParseLinks,
    protected alertService: AlertService,
    public accountService: AccountService,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: BaseDataUtils,
    protected router: Router,
    protected eventManager: EventManager,
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService
  ) {
    super(
      goodService,
      parseLinks,
      alertService,
      accountService,
      activatedRoute,
      dataUtils,
      router,
      eventManager,
      messageService,
      confirmationService
    );

    this.listChangeEventName = 'goodListModification';
    this.entityKeyName = 'id';
    this.predicate = 'id';
  }

  protected loadAllFilterBy() {
    const queryParams: any = { page: this.page - 1, size: this.itemsPerPage, sort: this.sort() };
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idProductType) {
      queryParams.idProductType = this.idProductType;
    }
    if (this.idConfig) {
      queryParams.idConfig = this.idConfig;
    }
    this.goodService.queryFilterBy(queryParams).subscribe(
      (res: HttpResponse<IGood[]>) => this.paginateItems(res.body, res.headers),
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idProductType']) {
      this.loadAll();
    }
    if (changes['idConfig']) {
      this.loadAll();
    }
  }

  trackId(index: number, item: IGood) {
    return item.id;
  }

  get goods() {
    return this.items;
  }

  set goods(good: IGood[]) {
    this.items = good;
  }

  addNewData() {
    const queryParams: any = {};
    if (this.filterName) {
      queryParams.filterName = this.filterName;
    }
    if (this.idProductType) {
      queryParams.productTypeId = this.idProductType;
    }
    if (this.idConfig) {
      queryParams.configId = this.idConfig;
    }
    this.router.navigate(['good/new', queryParams]);
  }

  onEditComplete(event: any) {
    this.goodService.update(event.data).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Data Updated', detail: 'Data updated...' });
      this.eventManager.broadcast({
        name: this.listChangeEventName,
        content: 'Completed an item',
      });
    });
  }
}
