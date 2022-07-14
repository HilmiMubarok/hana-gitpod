import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventManager } from 'app/core/util/event-manager.service';
import { AlertService } from 'app/core/util/alert.service';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { HttpResponse } from '@angular/common/http';

import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { AccountService } from 'app/core/auth/account.service';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

@Component({
  selector: 'jhi-organization-management-update',
  templateUrl: './organization-management-update.component.html',
})
export class OrganizationManagementUpdateComponent extends AbstractEntityUpdateComponent<IOrganizationManagement> {
  partygroups: IPartyGroup[] = [];
  organizationId: number;
  private routeSub: Subscription;

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
    return { item: new OrganizationManagement(), tasks: [], id: this.organizationId };
  }

  initialize() {
    // check url, if id is present, or not
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.organizationId = params.id;
    });

    // if url contains id, then load data by id
    this.organizationId ? this.findData() : null;
  }

  // method to find data by id, called when url contains id
  findData() {
    this.organizationManagementService.find(this.organizationId).subscribe((res: HttpResponse<IOrganizationManagement>) => {
      this.organizationManagement = res.body;
      console.log(this.organizationManagement);
    });
  }

  getDateTime(date: Date, opt: any = 'from'): Date {
    const dateTime = new Date(date);

    opt === 'thru' ? dateTime.setHours(23, 59, 59, 999) : dateTime.setHours(0, 0, 0, 0);

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

    this.organizationManagementService
      .create(data)
      .subscribe((res: HttpResponse<IOrganizationManagement>) =>
        this.toastService.add({ severity: 'success', summary: 'Success', detail: 'Data Saved!' })
      );
  }

  update() {
    const data = {
      id: this.organizationId,
      fromDate: this.getDateTime(this.organizationManagement.fromDate),
      thruDate: this.getDateTime(this.organizationManagement.thruDate, 'thru'),
    };

    this.organizationManagementService
      .update(data)
      .subscribe((res: HttpResponse<IOrganizationManagement>) =>
        this.toastService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated!' })
      );
  }
}
