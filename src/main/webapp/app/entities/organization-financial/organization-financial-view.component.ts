// import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';
// import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrganizationFinancial, OrganizationFinancial } from './organization-financial.model';
import { OrganizationFinancialService } from './organization-financial.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { ANIMATION, CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
// import { TranslateService } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { IPartyGroup, PartyGroup } from 'app/entities/party-group/party-group.model';
import { PartyGroupService } from 'app/entities/party-group/party-group.service';
import { Location } from '@angular/common';
// import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { SelectEventArgs } from '@syncfusion/ej2-angular-dropdowns';

@Component({
  selector: 'jhi-organization-financial-view',
  templateUrl: './organization-financial-view.component.html',
  styleUrls: ['../../../content/scss/vendor.scss', './organization.css'],
})
export class OrganizationFinancialViewComponent extends AbstractEntityBaseViewComponent<IOrganizationFinancial> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  partygroups: IPartyGroup[] = [];
  organizationId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected organizationFinancialService: OrganizationFinancialService,
    protected partyGroupService: PartyGroupService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(organizationFinancialService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new OrganizationFinancial();
  }

  public selected: String = 'Total Exposure < IDR 15 Bn';

  fa(args: SelectEventArgs) {
    this.selected = args.itemData.text;
  }

  public BlodType: string[] = ['Total Exposure > IDR 15 Bn', 'Total Exposure < IDR 15 Bn'];

  public path: Object = {
    saveUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
  };

  public onUploadSuccess(args: any): void {
    if (args.operation === 'upload') {
      console.log('File uploaded successfully');
    }
  }

  public onUploadFailure(args: any): void {
    console.log('File failed to upload');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new OrganizationFinancial();
        this.organizationFinancialService.find(this.id).subscribe(result => {
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
    this.partyGroupService.loadCacheAll().subscribe((res: IPartyGroup[]) => (this.partygroups = res || []));
  }

  prepareView() {}

  get organizationFinancial() {
    return this.item;
  }

  set organizationFinancial(organizationFinancial: IOrganizationFinancial) {
    this.item = organizationFinancial;
  }

  trackPartyGroupById(index: number, item: IPartyGroup) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }

  back(): void {
    this.location.back();
  }
}
