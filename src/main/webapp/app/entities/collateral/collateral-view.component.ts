import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICollateral, Collateral } from './collateral.model';
import { CollateralService } from './collateral.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { ICollateralType, CollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';

type SelectableEntity = ICollateralType | IParty | IApplication;

@Component({
  selector: 'jhi-collateral-view',
  templateUrl: './collateral-view.component.html',
  styleUrls: ['../collateral-appraisal/collateral-appraisal.css'],
})
export class CollateralViewComponent extends AbstractEntityBaseViewComponent<ICollateral> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  collateraltypes: ICollateralType[] = [];

  parties: IParty[] = [];

  applications: IApplication[] = [];
  collateralTypeId: string;
  partyId: string;
  applicationId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralService: CollateralService,
    protected collateralTypeService: CollateralTypeService,
    protected partyService: PartyService,
    protected applicationService: ApplicationService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(collateralService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Collateral();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Collateral();
        this.collateralService.find(this.id).subscribe(result => {
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
    this.collateralTypeService.loadCacheAll().subscribe((res: ICollateralType[]) => (this.collateraltypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.applicationService.loadCacheAll().subscribe((res: IApplication[]) => (this.applications = res || []));
  }

  prepareView() {}

  get collateral() {
    return this.item;
  }

  set collateral(collateral: ICollateral) {
    this.item = collateral;
  }

  trackCollateralTypeById(index: number, item: ICollateralType) {
    return item.id;
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
