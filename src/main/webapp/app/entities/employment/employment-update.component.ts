import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IEmployment, Employment } from './employment.model';
import { EmploymentService } from './employment.service';
import { IRelationType, RelationType } from 'app/entities/relation-type/relation-type.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';

type SelectableEntity = IRelationType | IParty;

@Component({
  selector: 'jhi-employment-update',
  templateUrl: './employment-update.component.html',
  styleUrls: ['./employment-update.style.css'],
})
export class EmploymentUpdateComponent extends AbstractEntityUpdateComponent<IEmployment> {
  relationtypes: IRelationType[] = [];

  public items: ItemModel[] = [
    {
      text: 'Cut',
    },
    {
      text: 'Copy',
    },
    {
      text: 'Paste',
    },
  ];

  public data = [];

  parties: IParty[] = [];
  relationTypeId: string;
  partyToId: string;
  partyFromId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected employmentService: EmploymentService,
    protected relationTypeService: RelationTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, employmentService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'employmentListModification';
  }

  protected initialState(): any {
    return { item: new Employment(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['relationTypeId']) {
        this.relationTypeId = params['relationTypeId'];
      }
      if (params['partyToId']) {
        this.partyToId = params['partyToId'];
      }
      if (params['partyFromId']) {
        this.partyFromId = params['partyFromId'];
      }
    });

    this.relationTypeService.loadCacheAll().subscribe((res: IRelationType[]) => (this.relationtypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));
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

  trackRelationTypeById(index: number, item: IRelationType) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get employment() {
    return this.item;
  }
}
