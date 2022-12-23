import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICreditRating, CreditRating } from 'app/entities/credit-rating/credit-rating.model';
import { CreditRatingService } from 'app/entities/credit-rating/credit-rating.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
// import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
// import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';
import { IPartyCif } from 'app/entities/party-cif/party-cif.model';
import { IDebtorCreditRating } from './credit-ratings.model';

@Component({
  selector: 'jhi-debtor-data-credit-rating',
  templateUrl: './debtor-data-credit-rating.component.html',
  styleUrls: ['./credit-rating-view.component.css'],
})
export class DebtorDataCreditRatingViewComponent extends AbstractEntityBaseViewComponent<ICreditRating> {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;
  public _partyCif: IPartyCif;
  public industry: string;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
    if (data.attributes['industry'].id === this.partyCif.id) {
      this.industry = data.attributes['industry'].industry;
    }
  }

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

  parse() {
    this.partyCif.creditRatings[0].idrMioLLL =
      (Number(this.partyCif.creditRatings[0].equityPosition) * Number(this.partyCif.creditRatings[0].internalMaxLLL)) / 100;
    return (Number(this.partyCif.creditRatings[0].equityPosition) * Number(this.partyCif.creditRatings[0].internalMaxLLL)) / 100;
  }
}
