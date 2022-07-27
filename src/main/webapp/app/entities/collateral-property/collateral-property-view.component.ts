import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICollateralProperty, CollateralProperty } from './collateral-property.model';
import { CollateralPropertyService } from './collateral-property.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { ICollateral, Collateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICollateralAppraisal, CollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { CollateralAppraisalService } from 'app/entities/collateral-appraisal/collateral-appraisal.service';

type SelectableEntity = IParty | ICollateral | ICollateralAppraisal;

@Component({
  selector: 'jhi-collateral-property-view',
  templateUrl: './collateral-property-view.component.html',
})
export class CollateralPropertyViewComponent extends AbstractEntityBaseViewComponent<ICollateralProperty> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  parties: IParty[] = [];

  collaterals: ICollateral[] = [];

  collateralappraisals: ICollateralAppraisal[] = [];
  partyId: string;
  collateralId: number;
  appraisalId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralPropertyService: CollateralPropertyService,
    protected partyService: PartyService,
    protected collateralService: CollateralService,
    protected collateralAppraisalService: CollateralAppraisalService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(collateralPropertyService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new CollateralProperty();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new CollateralProperty();
        this.collateralPropertyService.find(this.id).subscribe(result => {
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

    this.collateralService.loadCacheAll().subscribe((res: ICollateral[]) => (this.collaterals = res || []));

    this.collateralAppraisalService.loadCacheAll().subscribe((res: ICollateralAppraisal[]) => (this.collateralappraisals = res || []));
  }

  prepareView() {}

  get collateralProperty() {
    return this.item;
  }

  set collateralProperty(collateralProperty: ICollateralProperty) {
    this.item = collateralProperty;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackCollateralById(index: number, item: ICollateral) {
    return item.id;
  }

  trackCollateralAppraisalById(index: number, item: ICollateralAppraisal) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
