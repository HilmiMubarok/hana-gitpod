import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IFacility, Facility } from './facility.model';
import { FacilityService } from './facility.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IFacilityType, FacilityType } from 'app/entities/facility-type/facility-type.model';
import { FacilityTypeService } from 'app/entities/facility-type/facility-type.service';

type SelectableEntity = IFacilityType | IFacility;

@Component({
  selector: 'jhi-facility-view',
  templateUrl: './facility-view.component.html',
})
export class FacilityViewComponent extends AbstractEntityBaseViewComponent<IFacility> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  facilitytypes: IFacilityType[] = [];

  facilities: IFacility[] = [];
  facilityTypeId: string;
  partOfId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected facilityService: FacilityService,
    protected facilityTypeService: FacilityTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(facilityService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Facility();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Facility();
        this.facilityService.find(this.id).subscribe(result => {
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
    this.facilityTypeService.loadCacheAll().subscribe((res: IFacilityType[]) => (this.facilitytypes = res || []));

    this.facilityService.loadCacheAll().subscribe((res: IFacility[]) => (this.facilities = res || []));
  }

  prepareView() {}

  get facility() {
    return this.item;
  }

  set facility(facility: IFacility) {
    this.item = facility;
  }

  trackFacilityTypeById(index: number, item: IFacilityType) {
    return item.id;
  }

  trackFacilityById(index: number, item: IFacility) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
