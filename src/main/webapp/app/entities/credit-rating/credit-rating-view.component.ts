import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICreditRating, CreditRating } from './credit-rating.model';
import { CreditRatingService } from './credit-rating.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';

type SelectableEntity = IParty | IApplication;

@Component({
  selector: 'jhi-credit-rating-view',
  templateUrl: './credit-rating-view.component.html',
  styleUrls: ['./credit-rating-view.component.css'],
})
export class CreditRatingViewComponent extends AbstractEntityBaseViewComponent<ICreditRating> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  parties: IParty[] = [];

  applications: IApplication[] = [];
  partyId: string;
  applicationId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected creditRatingService: CreditRatingService,
    protected partyService: PartyService,
    protected applicationService: ApplicationService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(creditRatingService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new CreditRating();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new CreditRating();
        this.creditRatingService.find(this.id).subscribe(result => {
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
    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.applicationService.loadCacheAll().subscribe((res: IApplication[]) => (this.applications = res || []));
  }

  prepareView() {}

  onValCRChanged(ev): void {
    this.item.creditRating = ev;
  }

  onValIMChanged(ev): void {
    this.item.internalMaxLLL = ev;
  }

  onValEPChanged(ev): void {
    this.item.equityPosition = ev;
  }

  onValLLLChanged(ev): void {
    this.item.idrMioLLL = ev;
  }

  onValPefChanged(ev): void {
    this.item.pefindo = ev;
  }

  onValSNPChanged(ev): void {
    this.item.snp = ev;
  }

  onValFitChanged(ev): void {
    this.item.fitch = ev;
  }

  onValMoodChanged(ev): void {
    this.item.moodys = ev;
  }

  get creditRating() {
    return this.item;
  }

  set creditRating(creditRating: ICreditRating) {
    this.item = creditRating;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackApplicationById(index: number, item: IApplication) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
