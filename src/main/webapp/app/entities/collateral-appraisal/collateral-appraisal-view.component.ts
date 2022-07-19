import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICollateralAppraisal, CollateralAppraisal } from './collateral-appraisal.model';
import { CollateralAppraisalService } from './collateral-appraisal.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IBaseApplication, BaseApplication } from 'app/entities/base-application/base-application.model';
import { BaseApplicationService } from 'app/entities/base-application/base-application.service';
import { ICollateral, Collateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';

type SelectableEntity = IBaseApplication | ICollateral | IParty;

@Component({
  selector: 'jhi-collateral-appraisal-view',
  templateUrl: './collateral-appraisal-view.component.html',
})
export class CollateralAppraisalViewComponent extends AbstractEntityBaseViewComponent<ICollateralAppraisal> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  baseapplications: IBaseApplication[] = [];

  collaterals: ICollateral[] = [];

  parties: IParty[] = [];
  applicationId: number;
  collateralId: number;
  partyId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected baseApplicationService: BaseApplicationService,
    protected collateralService: CollateralService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(collateralAppraisalService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new CollateralAppraisal();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new CollateralAppraisal();
        this.collateralAppraisalService.find(this.id).subscribe(result => {
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
    this.baseApplicationService.loadCacheAll().subscribe((res: IBaseApplication[]) => (this.baseapplications = res || []));

    this.collateralService.loadCacheAll().subscribe((res: ICollateral[]) => (this.collaterals = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
  }

  prepareView() {}

  get collateralAppraisal() {
    return this.item;
  }

  set collateralAppraisal(collateralAppraisal: ICollateralAppraisal) {
    this.item = collateralAppraisal;
  }

  trackBaseApplicationById(index: number, item: IBaseApplication) {
    return item.id;
  }

  trackCollateralById(index: number, item: ICollateral) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
