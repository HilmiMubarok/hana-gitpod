import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { ICommEventType, CommEventType } from './comm-event-type.model';
import { CommEventTypeService } from './comm-event-type.service';
import { IContactMechType, ContactMechType } from 'app/entities/contact-mech-type/contact-mech-type.model';
import { ContactMechTypeService } from 'app/entities/contact-mech-type/contact-mech-type.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = ICommEventType | IContactMechType;

@Component({
  selector: 'jhi-comm-event-type-update',
  templateUrl: './comm-event-type-update.component.html',
})
export class CommEventTypeUpdateComponent extends AbstractEntityUpdateComponent<ICommEventType> {
  commeventtypes: ICommEventType[] = [];

  contactmechtypes: IContactMechType[] = [];
  parentId: string;
  contactTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected commEventTypeService: CommEventTypeService,
    protected contactMechTypeService: ContactMechTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, commEventTypeService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'commEventTypeListModification';
  }

  protected initialState(): any {
    return { item: new CommEventType(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['parentId']) {
        this.parentId = params['parentId'];
      }
      if (params['contactTypeId']) {
        this.contactTypeId = params['contactTypeId'];
      }
    });

    this.commEventTypeService.loadCacheAll().subscribe((res: ICommEventType[]) => (this.commeventtypes = res || []));

    this.contactMechTypeService.loadCacheAll().subscribe((res: IContactMechType[]) => (this.contactmechtypes = res || []));
  }

  protected loadRelatedEntityEffect(state: any): Observable<any> {
    const result = of(state);
    return result;
  }

  protected buildDependencyEffect(state: any): Observable<any> {
    return of(state);
  }

  protected prepareSaveEffect(state: any): Observable<any> {
    return of(state);
  }

  trackCommEventTypeById(index: number, item: ICommEventType) {
    return item.id;
  }

  trackContactMechTypeById(index: number, item: IContactMechType) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get commEventType() {
    return this.item;
  }
}
