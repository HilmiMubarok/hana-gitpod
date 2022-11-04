import { Component, ElementRef, Input, OnInit } from '@angular/core';
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
// import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
// import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';

import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { IPartyCif } from '../party-cif/party-cif.model';

@Component({
  selector: 'jhi-credit-rating-view',
  templateUrl: './credit-rating-view.component.html',
  styleUrls: ['./credit-rating-view.component.css'],
})
export class CreditRatingViewComponent extends AbstractEntityBaseViewComponent<ICreditRating> implements OnInit {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  public creditRatings: ICreditRating;
  public _creditProposalItem: ICreditProposal;
  public _partyCif: IPartyCif;
  public industry: string;
  public loading = false;

  @Input()
  get creditProposalItem() {
    return this._creditProposalItem;
  }

  set creditProposalItem(data: ICreditProposal) {
    this._creditProposalItem = data;
  }

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(data: IPartyCif) {
    this._partyCif = data;
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
  ) // private _ngxSpinner: NgxSpinnerService
  {
    super(creditRatingService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new CreditRating();
    this.creditRatings = new CreditRating();
  }

  parse() {
    this.creditRatings.idrMioLLL = Number(this.creditRatings.internalMaxLLL) * Number(this.creditRatings.equityPosition);
    return Number(this.creditRatings.internalMaxLLL) * Number(this.creditRatings.equityPosition);
  }

  parseCif() {
    this.creditRatings.idrMioLLL = Number(this.creditRatings.internalMaxLLL) * Number(this.creditRatings.equityPosition);
    return Number(this.creditRatings.internalMaxLLL) * Number(this.creditRatings.equityPosition);
  }

  ngOnInit() {
    if (this.creditProposalItem !== undefined) {
      this.creditRatingService
        .queryFilterBy({
          idParty: this.creditProposalItem.cif.partyId,
          page: 0,
          size: 10,
          sort: ['id', 'desc'],
        })
        .subscribe((res: any) => {
          this.creditRatings = res.body[0];
        });
    } else {
      this.creditRatingService
        .queryFilterBy({
          idParty: this.partyCif.partyId,
          page: 0,
          size: 10,
          sort: ['id', 'desc'],
        })
        .subscribe((res: any) => {
          this.creditRatings = res.body[0];
        });
    }
  }

  save() {
    this.creditRatingService.update(this.creditRatings).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });
    });
  }

  public cifNumber: string;

  syncCreditReting() {
    location.reload();
    // this.loading = true;
    this.creditRatingService.creditRetingSync(this.partyCif.customerNumber).subscribe(res => {
      this.loading = false;
      this.cifNumber = res.body.creditRating;
    });
  }
}
