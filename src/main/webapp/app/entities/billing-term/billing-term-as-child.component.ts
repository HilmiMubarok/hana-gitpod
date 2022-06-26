import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from '../../core/auth/account.service';
import { IBillingTerm, BillingTerm } from './billing-term.model';
import { BillingTermService } from './billing-term.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AbstractEntityGridComponent } from 'app/shared/base/abstract-entity-grid.component';

@Component({
  selector: 'jhi-billing-term-as-child',
  templateUrl: './billing-term-as-child.component.html',
})
export class BillingTermAsChildComponent extends AbstractEntityGridComponent<IBillingTerm> implements OnChanges {
  selectedItem: IBillingTerm;

  visibleAdd: boolean;
  visibleEdit: boolean;

  constructor(
    protected billingTermService: BillingTermService,
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
    super(billingTermService, dataUtils);
  }

  protected initialize() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.items) {
      this.totalItems = this.items.length;
    }
  }

  trackId(index: number, item: IBillingTerm) {
    return item.id;
  }

  get billingTerms() {
    return this.items;
  }

  set billingTerms(billingTerm: IBillingTerm[]) {
    this.items = billingTerm;
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
