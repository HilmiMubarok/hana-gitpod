import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-organization-management-update',
  templateUrl: './organization-management-update.component.html',
  styleUrls: ['./organization-management-update-component.css'],
})
export class OrganizationManagementUpdateComponent extends AbstractEntityUpdateComponent<IOrganizationManagement> {
  partygroups: IPartyGroup[] = [];
  organizationId: string;

  public organizationManagement: IOrganizationManagement = new OrganizationManagement();

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationManagementService: OrganizationManagementService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    protected accountService: AccountService
  ) {
    super(dataUtils, organizationManagementService, elementRef, confirmationService, toastService, activatedRoute);
    this.listChangeEventName = 'organizationManagementListModification';
  }

  protected initialState(): any {
    return { item: new OrganizationManagement(), tasks: [], id: undefined };
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

  getDateTime(date: Date, opt: any = 'from'): Date {
    const dateTime = new Date(date);

    // if opt is "thru" then set time to 23:59:59
    if (opt === 'thru') {
      dateTime.setHours(23, 59, 59, 999);
    } else {
      // if opt is "from" then set time to 00:00:00
      dateTime.setHours(0, 0, 0, 0);
    }

    const year = dateTime.getFullYear();
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const day = ('0' + dateTime.getDate()).slice(-2);
    const hour = ('0' + dateTime.getHours()).slice(-2);
    const minute = ('0' + dateTime.getMinutes()).slice(-2);
    const second = ('0' + dateTime.getSeconds()).slice(-2);
    const result = year + '-' + month + '-' + day + ':' + hour + ':' + minute + ':' + second;

    return new Date(result);
  }

  save() {
    const data = {
      fromDate: this.getDateTime(this.organizationManagement.fromDate),
      thruDate: this.getDateTime(this.organizationManagement.thruDate, 'thru'),
    };
    // console.log(data);
    this.organizationManagementService.create(data).subscribe((res: HttpResponse<IOrganizationManagement>) => console.log(res));
  }
}
