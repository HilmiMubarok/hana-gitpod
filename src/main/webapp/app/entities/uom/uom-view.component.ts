import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IUom, Uom } from './uom.model';
import { UomService } from './uom.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IUomType, UomType } from 'app/entities/uom-type/uom-type.model';
import { UomTypeService } from 'app/entities/uom-type/uom-type.service';

@Component({
  selector: 'jhi-uom-view',
  templateUrl: './uom-view.component.html',
})
export class UomViewComponent extends AbstractEntityBaseViewComponent<IUom> implements OnChanges {
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  uomtypes: IUomType[] = [];
  uomTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected uomService: UomService,
    protected uomTypeService: UomTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(uomService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Uom();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Uom();
        this.uomService.find(this.id).subscribe(result => {
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
    this.uomTypeService.loadCacheAll().subscribe((res: IUomType[]) => (this.uomtypes = res || []));
  }

  prepareView() {}

  get uom() {
    return this.item;
  }

  set uom(uom: IUom) {
    this.item = uom;
  }

  trackUomTypeById(index: number, item: IUomType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
