import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IOrganizationLegal, OrganizationLegal } from './organization-legal.model';
import { OrganizationLegalService } from './organization-legal.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-organization-legal-update',
  templateUrl: './organization-legal-update.component.html',
})
export class OrganizationLegalUpdateComponent extends AbstractEntityUpdateComponent<IOrganizationLegal> {
  partygroups: IPartyGroup[] = [];
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationLegalService: OrganizationLegalService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, organizationLegalService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'organizationLegalListModification';
  }

  protected initialState(): any {
    return { item: new OrganizationLegal(), tasks: [], id: undefined };
  }

  initialize() {
    combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
      this.currentAccount = account_;

      // Read Route Parameter
      if (params['organizationId']) {
        this.organizationId = params['organizationId'];
      }
    });

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

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.stateSubject.getValue().item.id;
  }

  get organizationLegal() {
    return this.item;
  }
}
