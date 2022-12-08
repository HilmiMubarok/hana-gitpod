import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPositionReportingStructure, PositionReportingStructure } from './position-reporting-structure.model';
import { PositionReportingStructureService } from './position-reporting-structure.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IRelationType, RelationType } from 'app/entities/relation-type/relation-type.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { IPosition, Position } from 'app/entities/position/position.model';
import { PositionService } from 'app/entities/position/position.service';

type SelectableEntity = IRelationType | IPosition;

@Component({
  selector: 'jhi-position-reporting-structure-view',
  templateUrl: './position-reporting-structure-view.component.html',
})
export class PositionReportingStructureViewComponent
  extends AbstractEntityBaseViewComponent<IPositionReportingStructure>
  implements OnChanges
{
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  relationtypes: IRelationType[] = [];

  positions: IPosition[] = [];
  relationTypeId: string;
  positionFromId: number;
  positionToId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected positionReportingStructureService: PositionReportingStructureService,
    protected relationTypeService: RelationTypeService,
    protected positionService: PositionService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(positionReportingStructureService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PositionReportingStructure();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PositionReportingStructure();
        this.positionReportingStructureService.find(this.id).subscribe(result => {
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
    this.relationTypeService.loadCacheAll().subscribe((res: IRelationType[]) => (this.relationtypes = res || []));

    this.positionService.loadCacheAll().subscribe((res: IPosition[]) => (this.positions = res || []));
  }

  prepareView() {}

  get positionReportingStructure() {
    return this.item;
  }

  set positionReportingStructure(positionReportingStructure: IPositionReportingStructure) {
    this.item = positionReportingStructure;
  }

  trackRelationTypeById(index: number, item: IRelationType) {
    return item.id;
  }

  trackPositionById(index: number, item: IPosition) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
