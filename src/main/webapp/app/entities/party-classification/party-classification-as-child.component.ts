import { Component, ViewChild, ElementRef, OnChanges, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from '../../core/auth/account.service';
import { IPartyClassification, PartyClassification } from './party-classification.model';
import { PartyClassificationService } from './party-classification.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { ParseLinks } from 'app/core/util/parse-links.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { AbstractEntityGridComponent } from 'app/shared/base/abstract-entity-grid.component';

@Component({
  selector: 'jhi-party-classification-as-child',
  templateUrl: './party-classification-as-child.component.html',
})
export class PartyClassificationAsChildComponent extends AbstractEntityGridComponent<IPartyClassification> implements OnChanges {
  selectedItem: IPartyClassification;

  visibleAdd: boolean;
  visibleEdit: boolean;

  constructor(
    protected partyClassificationService: PartyClassificationService,
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
    super(partyClassificationService, dataUtils);
  }

  protected initialize() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.items) {
      this.totalItems = this.items.length;
    }
  }

  trackId(index: number, item: IPartyClassification) {
    return item.id;
  }

  get partyClassifications() {
    return this.items;
  }

  set partyClassifications(partyClassification: IPartyClassification[]) {
    this.items = partyClassification;
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
