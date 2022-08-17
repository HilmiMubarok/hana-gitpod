import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ISurveyor, Surveyor } from './surveyor.model';
import { SurveyorService } from './surveyor.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IRoleType, RoleType } from 'app/entities/role-type/role-type.model';
import { RoleTypeService } from 'app/entities/role-type/role-type.service';
import { IPerson, Person } from 'app/entities/person/person.model';
import { PersonService } from 'app/entities/person/person.service';

type SelectableEntity = IRoleType | IPerson;

@Component({
  selector: 'jhi-surveyor-view',
  templateUrl: './surveyor-view.component.html',
})
export class SurveyorViewComponent extends AbstractEntityBaseViewComponent<ISurveyor> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  roletypes: IRoleType[] = [];

  people: IPerson[] = [];
  roleId: string;
  personId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected surveyorService: SurveyorService,
    protected roleTypeService: RoleTypeService,
    protected personService: PersonService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(surveyorService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Surveyor();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Surveyor();
        this.surveyorService.find(this.id).subscribe(result => {
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
    this.roleTypeService.loadCacheAll().subscribe((res: IRoleType[]) => (this.roletypes = res || []));

    this.personService.loadCacheAll().subscribe((res: IPerson[]) => (this.people = res || []));
  }

  prepareView() {}

  get surveyor() {
    return this.item;
  }

  set surveyor(surveyor: ISurveyor) {
    this.item = surveyor;
  }

  trackRoleTypeById(index: number, item: IRoleType) {
    return item.id;
  }

  trackPersonById(index: number, item: IPerson) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }
}
