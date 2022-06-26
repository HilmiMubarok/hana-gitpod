import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IGeoBoundaryType, GeoBoundaryType } from './geo-boundary-type.model';
import { GeoBoundaryTypeService } from './geo-boundary-type.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-geo-boundary-type-view',
  templateUrl: './geo-boundary-type-view.component.html',
})
export class GeoBoundaryTypeViewComponent extends AbstractEntityBaseViewComponent<IGeoBoundaryType> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  geoboundarytypes: IGeoBoundaryType[] = [];
  parentId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected geoBoundaryTypeService: GeoBoundaryTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(geoBoundaryTypeService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new GeoBoundaryType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new GeoBoundaryType();
        this.geoBoundaryTypeService.find(this.id).subscribe(result => {
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

  get geoBoundaryType() {
    return this.item;
  }

  set geoBoundaryType(geoBoundaryType: IGeoBoundaryType) {
    this.item = geoBoundaryType;
  }

  trackGeoBoundaryTypeById(index: number, item: IGeoBoundaryType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
