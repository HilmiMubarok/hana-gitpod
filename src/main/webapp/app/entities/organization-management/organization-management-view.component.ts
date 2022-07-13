import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-organization-management-view',
  templateUrl: './organization-management-view.component.html',
})
export class OrganizationManagementViewComponent extends AbstractEntityBaseViewComponent<IOrganizationManagement> {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  partygroups: IPartyGroup[] = [];
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationManagementService: OrganizationManagementService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected toastService: MessageService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(organizationManagementService, messageService, elementRef, dataUtils, account, eventManager);
    this.organizationManagement = new OrganizationManagement();
  }

  private routeSub: Subscription;

  public organizationManagement: IOrganizationManagement = new OrganizationManagement();

  update() {
    console.log(this.organizationManagement);
  }

  initialize() {
    // check url, if id is present, or not
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      this.organizationId = params.id;
    });

    // if url contains id, then load data by id
    this.organizationId ? this.findData() : null;
  }

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

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['id']) {
  //     if (changes['id'].isFirstChange()) {
  //       this.initialize();
  //     }
  //     if (this.id) {
  //       this.item = new OrganizationManagement();
  //       this.organizationManagementService.find(this.id).subscribe(result => {
  //         this.item = result.body;
  //         this.prepareView();
  //       });
  //     }
  //   }

  //   if (changes['item']) {
  //     if (changes['item'].isFirstChange()) {
  //       this.initialize();
  //     }
  //     if (this.item) {
  //       this.prepareView();
  //     }
  //   }

  //   if (changes['isSaving'] && this.item.id) {
  //     if (this.isSaving) {
  //       this.save();
  //     }
  //   }
  // }

  // initialize() {
  //   this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  // }

  // prepareView() {}

  // get organizationManagement() {
  //   return this.item;
  // }

  // set organizationManagement(organizationManagement: IOrganizationManagement) {
  //   this.item = organizationManagement;
  // }

  // trackPartyGroupById(index: number, item: IPartyGroup) {
  //   return item.id;
  // }

  // itemKey() {
  //   return this.item.id;
  // }
}
