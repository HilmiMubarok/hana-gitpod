import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IBaseApplication, BaseApplication } from './base-application.model';
import { BaseApplicationService } from './base-application.service';
import { IApplicationType, ApplicationType } from 'app/entities/application-type/application-type.model';
import { ApplicationTypeService } from 'app/entities/application-type/application-type.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

type SelectableEntity = IApplicationType | IPartyGroup;

@Component({
  selector: 'jhi-base-application-update',
  templateUrl: './base-application-update.component.html',
})
export class BaseApplicationUpdateComponent extends AbstractEntityUpdateComponent<IBaseApplication> {
  applicationtypes: IApplicationType[] = [];

  partygroups: IPartyGroup[] = [];
  applicationTypeId: string;
  internalId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected baseApplicationService: BaseApplicationService,
    protected applicationTypeService: ApplicationTypeService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, baseApplicationService, elementRef, confirmationService, toastService, activatedRoute);
    this.useTask = true;
    this.listChangeEventName = 'baseApplicationListModification';
  }

  protected initialState(): any {
    return { item: new BaseApplication(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['applicationTypeId']) {
        this.applicationTypeId = params['applicationTypeId'];
      }
      if (params['internalId']) {
        this.internalId = params['internalId'];
      }
    });

    this.applicationTypeService.loadCacheAll().subscribe((res: IApplicationType[]) => (this.applicationtypes = res || []));

    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
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

  trackApplicationTypeById(index: number, item: IApplicationType) {
    return item.id;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get baseApplication() {
    return this.item;
  }
}
