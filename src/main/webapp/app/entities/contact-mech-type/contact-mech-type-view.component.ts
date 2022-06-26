import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IContactMechType, ContactMechType } from './contact-mech-type.model';
import { ContactMechTypeService } from './contact-mech-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPurposeType, PurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';

type SelectableEntity = IContactMechType | IPurposeType;

@Component({
  selector: 'jhi-contact-mech-type-view',
  templateUrl: './contact-mech-type-view.component.html',
})
export class ContactMechTypeViewComponent extends AbstractEntityBaseViewComponent<IContactMechType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  contactmechtypes: IContactMechType[] = [];

  purposetypes: IPurposeType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected contactMechTypeService: ContactMechTypeService,
    protected purposeTypeService: PurposeTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(contactMechTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new ContactMechType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new ContactMechType();
        this.contactMechTypeService.find(this.id).subscribe(result => {
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
    this.contactMechTypeService.loadCacheAll().subscribe((res: IContactMechType[]) => (this.contactmechtypes = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));
  }

  prepareView() {}

  get contactMechType() {
    return this.item;
  }

  set contactMechType(contactMechType: IContactMechType) {
    this.item = contactMechType;
  }

  trackContactMechTypeById(index: number, item: IContactMechType) {
    return item.id;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }

  getSelected(selectedVals: IPurposeType[], option: IPurposeType): IPurposeType {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
