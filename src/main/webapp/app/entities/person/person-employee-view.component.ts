import { Component, ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EventManager } from 'app/core/util/event-manager.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { MessageService } from 'primeng/api';
import { PartyTypeService } from '../party-type/party-type.service';
import { IPerson } from './person.model';
import { PersonService } from './person.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@Component({
  selector: 'jhi-person-employee-view',
  templateUrl: './person-employee-view.component.html',
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'id',
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class PersonEmployeeViewComponent extends AbstractEntityBaseViewComponent<IPerson> implements OnChanges, OnInit {
  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected personService: PersonService,
    protected partyTypeService: PartyTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(personService, messageService, elementRef, dataUtils, account, eventManager);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      throw new Error('Method not implemented.');
    }
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
