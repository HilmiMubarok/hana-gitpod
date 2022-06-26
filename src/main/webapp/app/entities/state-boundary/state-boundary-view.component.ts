import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IStateBoundary, StateBoundary } from './state-boundary.model';
import { StateBoundaryService } from './state-boundary.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IGeoBoundaryType, GeoBoundaryType } from 'app/entities/geo-boundary-type/geo-boundary-type.model';
import { GeoBoundaryTypeService } from 'app/entities/geo-boundary-type/geo-boundary-type.service';

type SelectableEntity = IGeoBoundaryType | IStateBoundary;

@Component({
  selector: 'jhi-state-boundary-view',
  templateUrl: './state-boundary-view.component.html',
})
export class StateBoundaryViewComponent extends AbstractEntityBaseViewComponent<IStateBoundary> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  geoboundarytypes: IGeoBoundaryType[] = [];

  stateboundaries: IStateBoundary[] = [];
  boundaryTypeId: string;
  parentId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected stateBoundaryService: StateBoundaryService,
    protected geoBoundaryTypeService: GeoBoundaryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(stateBoundaryService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new StateBoundary();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new StateBoundary();
        this.stateBoundaryService.find(this.id).subscribe(result => {
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
    this.geoBoundaryTypeService.loadCacheAll().subscribe((res: IGeoBoundaryType[]) => (this.geoboundarytypes = res || []));

    this.stateBoundaryService.loadCacheAll().subscribe((res: IStateBoundary[]) => (this.stateboundaries = res || []));
  }

  prepareView() {}

  get stateBoundary() {
    return this.item;
  }

  set stateBoundary(stateBoundary: IStateBoundary) {
    this.item = stateBoundary;
  }

  trackGeoBoundaryTypeById(index: number, item: IGeoBoundaryType) {
    return item.id;
  }

  trackStateBoundaryById(index: number, item: IStateBoundary) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
