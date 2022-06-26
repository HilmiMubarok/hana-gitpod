import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGeoBoundary, GeoBoundary } from './geo-boundary.model';
import { GeoBoundaryService } from './geo-boundary.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IGeoBoundaryType, GeoBoundaryType } from 'app/entities/geo-boundary-type/geo-boundary-type.model';
import { GeoBoundaryTypeService } from 'app/entities/geo-boundary-type/geo-boundary-type.service';

@Component({
  selector: 'jhi-geo-boundary-view',
  templateUrl: './geo-boundary-view.component.html',
})
export class GeoBoundaryViewComponent extends AbstractEntityBaseViewComponent<IGeoBoundary> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  geoboundarytypes: IGeoBoundaryType[] = [];
  boundaryTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected geoBoundaryService: GeoBoundaryService,
    protected geoBoundaryTypeService: GeoBoundaryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(geoBoundaryService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new GeoBoundary();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new GeoBoundary();
        this.geoBoundaryService.find(this.id).subscribe(result => {
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
  }

  prepareView() {}

  get geoBoundary() {
    return this.item;
  }

  set geoBoundary(geoBoundary: IGeoBoundary) {
    this.item = geoBoundary;
  }

  trackGeoBoundaryTypeById(index: number, item: IGeoBoundaryType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
