import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyCategory, PartyCategory } from './party-category.model';
import { PartyCategoryService } from './party-category.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyCategoryType, PartyCategoryType } from 'app/entities/party-category-type/party-category-type.model';
import { PartyCategoryTypeService } from 'app/entities/party-category-type/party-category-type.service';

type SelectableEntity = IPartyCategoryType | IPartyCategory;

@Component({
  selector: 'jhi-party-category-view',
  templateUrl: './party-category-view.component.html',
})
export class PartyCategoryViewComponent extends AbstractEntityBaseViewComponent<IPartyCategory> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partycategorytypes: IPartyCategoryType[] = [];

  partycategories: IPartyCategory[] = [];
  categoryTypeId: string;
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyCategoryService: PartyCategoryService,
    protected partyCategoryTypeService: PartyCategoryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyCategoryService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyCategory();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartyCategory();
        this.partyCategoryService.find(this.id).subscribe(result => {
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
    this.partyCategoryTypeService.loadCacheAll().subscribe((res: IPartyCategoryType[]) => (this.partycategorytypes = res || []));

    this.partyCategoryService.loadCacheAll().subscribe((res: IPartyCategory[]) => (this.partycategories = res || []));
  }

  prepareView() {}

  get partyCategory() {
    return this.item;
  }

  set partyCategory(partyCategory: IPartyCategory) {
    this.item = partyCategory;
  }

  trackPartyCategoryTypeById(index: number, item: IPartyCategoryType) {
    return item.id;
  }

  trackPartyCategoryById(index: number, item: IPartyCategory) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
