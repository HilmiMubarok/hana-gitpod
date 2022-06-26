import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from '../../core/auth/account.service';
import { IBillingItem, BillingItem } from './billing-item.model';
import { BillingItemService } from './billing-item.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AbstractEntityGridComponent } from 'app/shared/base/abstract-entity-grid.component';

@Component({
  selector: 'jhi-billing-item-as-child',
  templateUrl: './billing-item-as-child.component.html',
})
export class BillingItemAsChildComponent extends AbstractEntityGridComponent<IBillingItem> implements OnChanges {
  selectedItem: IBillingItem;

  visibleAdd: boolean;
  visibleEdit: boolean;

  constructor(
    protected billingItemService: BillingItemService,
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
    super(billingItemService, dataUtils);
  }

  protected initialize() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.items) {
      this.totalItems = this.items.length;
    }
  }

  trackId(index: number, item: IBillingItem) {
    return item.id;
  }

  get billingItems() {
    return this.items;
  }

  set billingItems(billingItem: IBillingItem[]) {
    this.items = billingItem;
  }

  addItem() {
    this.itemService.template('default').subscribe(res => {
      const data = res.body;
      this.selectedItem = data;
      this.visibleAdd = true;
    });
  }

  editItem(item: any) {
    this.selectedItem = item;
    this.visibleEdit = true;
  }

  hideChild() {
    if (this.visibleAdd || this.visibleEdit) {
      this.itemSave.emit(this.selectedItem);
    }
    this.selectedItem = undefined;
    this.visibleEdit = false;
    this.visibleAdd = false;
  }

  deleteItem(item: any) {
    this.itemDelete.emit(item);
  }
}
