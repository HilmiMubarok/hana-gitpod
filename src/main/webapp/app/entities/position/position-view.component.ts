import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPosition, Position } from './position.model';
import { PositionService } from './position.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPositionType, PositionType } from 'app/entities/position-type/position-type.model';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { IEmployee, Employee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { IInternal, Internal } from 'app/entities/internal/internal.model';
import { InternalService } from 'app/entities/internal/internal.service';

type SelectableEntity = IPositionType | IEmployee | IInternal;

@Component({
  selector: 'jhi-position-view',
  templateUrl: './position-view.component.html',
})
export class PositionViewComponent extends AbstractEntityBaseViewComponent<IPosition> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  positiontypes: IPositionType[] = [];

  employees: IEmployee[] = [];

  internals: IInternal[] = [];
  positionTypeId: string;
  employeeId: number;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected positionService: PositionService,
    protected positionTypeService: PositionTypeService,
    protected employeeService: EmployeeService,
    protected internalService: InternalService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(positionService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Position();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Position();
        this.positionService.find(this.id).subscribe(result => {
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
    this.positionTypeService.loadCacheAll().subscribe((res: IPositionType[]) => (this.positiontypes = res || []));

    this.employeeService.loadCacheAll().subscribe((res: IEmployee[]) => (this.employees = res || []));

    this.internalService.loadCacheAll().subscribe((res: IInternal[]) => (this.internals = res || []));
  }

  prepareView() {}

  get position() {
    return this.item;
  }

  set position(position: IPosition) {
    this.item = position;
  }

  trackPositionTypeById(index: number, item: IPositionType) {
    return item.id;
  }

  trackEmployeeById(index: number, item: IEmployee) {
    return item.id;
  }

  trackInternalById(index: number, item: IInternal) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
