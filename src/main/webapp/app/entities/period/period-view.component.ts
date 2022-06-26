import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPeriod, Period } from './period.model';
import { PeriodService } from './period.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPeriodType, PeriodType } from 'app/entities/period-type/period-type.model';
import { PeriodTypeService } from 'app/entities/period-type/period-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IPeriodType | IPeriod | IParty;

@Component({
  selector: 'jhi-period-view',
  templateUrl: './period-view.component.html',
})
export class PeriodViewComponent extends AbstractEntityBaseViewComponent<IPeriod> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  periodtypes: IPeriodType[] = [];

  periods: IPeriod[] = [];

  parties: IParty[] = [];
  periodTypeId: string;
  parentId: number;
  ownerId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected periodService: PeriodService,
    protected periodTypeService: PeriodTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(periodService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Period();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Period();
        this.periodService.find(this.id).subscribe(result => {
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
    this.periodTypeService.loadCacheAll().subscribe((res: IPeriodType[]) => (this.periodtypes = res || []));

    this.periodService.loadCacheAll().subscribe((res: IPeriod[]) => (this.periods = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get period() {
    return this.item;
  }

  set period(period: IPeriod) {
    this.item = period;
  }

  trackPeriodTypeById(index: number, item: IPeriodType) {
    return item.id;
  }

  trackPeriodById(index: number, item: IPeriod) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
