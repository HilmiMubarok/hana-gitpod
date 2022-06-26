import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IUomConversion, UomConversion } from './uom-conversion.model';
import { UomConversionService } from './uom-conversion.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IUom, Uom } from 'app/entities/uom/uom.model';
import { UomService } from 'app/entities/uom/uom.service';

@Component({
  selector: 'jhi-uom-conversion-view',
  templateUrl: './uom-conversion-view.component.html',
})
export class UomConversionViewComponent extends AbstractEntityBaseViewComponent<IUomConversion> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  uoms: IUom[] = [];
  uomToId: string;
  uomFromId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected uomConversionService: UomConversionService,
    protected uomService: UomService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(uomConversionService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new UomConversion();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new UomConversion();
        this.uomConversionService.find(this.id).subscribe(result => {
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
    this.uomService.loadCacheAll().subscribe((res: IUom[]) => (this.uoms = res || []));
  }

  prepareView() {}

  get uomConversion() {
    return this.item;
  }

  set uomConversion(uomConversion: IUomConversion) {
    this.item = uomConversion;
  }

  trackUomById(index: number, item: IUom) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
