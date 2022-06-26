import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyClassification, PartyClassification } from './party-classification.model';
import { PartyClassificationService } from './party-classification.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyCategory, PartyCategory } from 'app/entities/party-category/party-category.model';
import { PartyCategoryService } from 'app/entities/party-category/party-category.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IPartyCategory | IParty;

@Component({
  selector: 'jhi-party-classification-view',
  templateUrl: './party-classification-view.component.html',
})
export class PartyClassificationViewComponent extends AbstractEntityBaseViewComponent<IPartyClassification> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  partycategories: IPartyCategory[] = [];

  parties: IParty[] = [];
  categoryId: string;
  partyId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyClassificationService: PartyClassificationService,
    protected partyCategoryService: PartyCategoryService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyClassificationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyClassification();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartyClassification();
        this.partyClassificationService.find(this.id).subscribe(result => {
          this.item = result.body;
          this.prepareView();
        });
      }
    }

    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      if (this.item) {
        this.prepareView();
      }
    }

    if (changes['isSaving'] && this.item.id) {
      if (this.isSaving) {
        this.save();
      }
    }
  }

  initialize() {
    this.partyCategoryService.loadCacheAll().subscribe((res: IPartyCategory[]) => (this.partycategories = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get partyClassification() {
    return this.item;
  }

  set partyClassification(partyClassification: IPartyClassification) {
    this.item = partyClassification;
  }

  trackPartyCategoryById(index: number, item: IPartyCategory) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
