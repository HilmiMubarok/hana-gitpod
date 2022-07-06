import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyIdentification, PartyIdentification } from './party-identification.model';
import { PartyIdentificationService } from './party-identification.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IIdentificationType, IdentificationType } from 'app/entities/identification-type/identification-type.model';
import { IdentificationTypeService } from 'app/entities/identification-type/identification-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IIdentificationType | IParty;

@Component({
  selector: 'jhi-party-identification-view',
  templateUrl: './party-identification-view.component.html',
})
export class PartyIdentificationViewComponent extends AbstractEntityBaseViewComponent<IPartyIdentification> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  identificationtypes: IIdentificationType[] = [];

  parties: IParty[] = [];
  identificationTypeId: string;
  partyId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyIdentificationService: PartyIdentificationService,
    protected identificationTypeService: IdentificationTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyIdentificationService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyIdentification();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartyIdentification();
        this.partyIdentificationService.find(this.id).subscribe(result => {
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
    this.identificationTypeService.loadCacheAll().subscribe((res: IIdentificationType[]) => (this.identificationtypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get partyIdentification() {
    return this.item;
  }

  set partyIdentification(partyIdentification: IPartyIdentification) {
    this.item = partyIdentification;
  }

  trackIdentificationTypeById(index: number, item: IIdentificationType) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
