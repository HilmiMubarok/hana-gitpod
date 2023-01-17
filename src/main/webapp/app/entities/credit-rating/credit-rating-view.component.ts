import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
import { ApplicationOptionService } from '../application-option/application-option.service';
import { ListOfValueIndustryService } from '../credit-proposal/list-of-value-industry.service';
import { IListOfValueIndustry } from '../../../../../../src/main/webapp/app/entities/credit-proposal/list-of-value-industry.model';

@Component({
  selector: 'jhi-credit-rating-view',
  templateUrl: './credit-rating-view.component.html',
  styleUrls: ['./credit-rating-view.component.css'],
})
export class CreditRatingViewComponent extends AbstractEntityBaseViewComponent<ICreditRating> implements OnInit, OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  public creditRatings: ICreditRating;
  public _creditProposalItem: ICreditProposal;
  public _partyCif: IPartyCif;
  public industry: string;
  public loading = false;
  public listOfIndustry: IListOfValueIndustry[];
  public industryList: string[] = [];

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
    public account: AccountService,
    protected applicationOptionService: ApplicationOptionService,
    public listOfIndustryService: ListOfValueIndustryService // private _ngxSpinner: NgxSpinnerService
  ) {
    super(creditRatingService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new CreditRating();
    this.creditRatings = new CreditRating();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getApplicationOption();
  }

  parse() {
    this.creditRatings.idrMioLLL = Number(this.creditRatings.equityPosition) * (Number(this.creditRatings.internalMaxLLL) / 100);
    return Number(this.creditRatings.equityPosition) * (Number(this.creditRatings.internalMaxLLL) / 100);
  }

  parseCif() {
    this.creditRatings.idrMioLLL = Number(this.creditRatings.equityPosition) * (Number(this.creditRatings.internalMaxLLL) / 100);
    return Number(this.creditRatings.equityPosition) * (Number(this.creditRatings.internalMaxLLL) / 100);
  }
  public industrys: string;
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
          if (res.body.length < 1) {
            this.creditRatings = new CreditRating();
          } else {
            this.creditRatings = res.body[0];
          }
        });
    } else {
      this.creditRatings = this.partyCif.creditRatings[0];
      this.industrys = this.partyCif.creditRatings[0].attributes['industry'];
    }

    this.getApplicationOption();
    this.getListIndustry();
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
    this.creditRatingService.creditRetingSync(this.partyCif.customerNumber).subscribe(res => {
      this.cifNumber = res.body.creditRatings[0].creditRating;
      this.creditRatings.creditRating = this.cifNumber;
      if (res.status === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'SYNC From Hobis Successful',
        });
      }
      if (!this.cifNumber) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Data Not Found From HOBIS',
        });
      }
      if (res.status === 500) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'SYNC From HOBIS Failed',
        });
      }
      this.getApplicationOption();
    });
  }

  public equityPosition: any;
  public equityPositionDate: any;

  public getApplicationOption() {
    this.applicationOptionService.query().subscribe(res => {
      for (let i = 0; i < res.body.length; i++) {
        if (res.body[i].id === 'EQUITY_POSITION_AS_VALUE') {
          this.equityPosition = res.body[i].value;
        }
        if (res.body[i].id === 'EQUITY_POSITION_AS_DATE_OF') {
          this.equityPositionDate = res.body[i].value;
        }
        this.partyCif.creditRatings[0].equityPosition = this.equityPosition;
        this.partyCif.creditRatings[0].equityPositionDate = this.equityPositionDate;
      }

      this.creditRatings.equityPosition = this.partyCif.creditRatings[0].equityPosition;
      this.creditRatings.equityPositionDate = this.partyCif.creditRatings[0].equityPositionDate;
    });
  }

  public changeEvent(event: any) {
    this.partyCif.creditRatings[0].attributes['industry'] = event.itemData['text'];
  }

  public getListIndustry() {
    this.listOfIndustryService.query().subscribe((res: any) => {
      for (let i = 0; i < res.body.length; i++) {
        this.industryList = [...this.industryList, res.body[i].label];
      }
    });
  }
}
