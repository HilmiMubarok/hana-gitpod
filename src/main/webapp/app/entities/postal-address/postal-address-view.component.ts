import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPostalAddress, PostalAddress } from './postal-address.model';
import { PostalAddressService } from './postal-address.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IContactMechType, ContactMechType } from 'app/entities/contact-mech-type/contact-mech-type.model';
import { ContactMechTypeService } from 'app/entities/contact-mech-type/contact-mech-type.service';
import { IPurposeType, PurposeType } from 'app/entities/purpose-type/purpose-type.model';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { IStateBoundary, StateBoundary } from 'app/entities/state-boundary/state-boundary.model';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';

type SelectableEntity = IContactMechType | IPurposeType | IStateBoundary;

@Component({
  selector: 'jhi-postal-address-view',
  templateUrl: './postal-address-view.component.html',
})
export class PostalAddressViewComponent extends AbstractEntityBaseViewComponent<IPostalAddress> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  contactmechtypes: IContactMechType[] = [];

  purposetypes: IPurposeType[] = [];

  stateboundaries: IStateBoundary[] = [];
  contactTypeId: string;
  countryItems: IStateBoundary[] = [];
  countrySelect: IStateBoundary;
  countryId: number;
  provinceItems: IStateBoundary[] = [];
  provinceSelect: IStateBoundary;
  provinceId: number;
  cityItems: IStateBoundary[] = [];
  citySelect: IStateBoundary;
  cityId: number;
  districtItems: IStateBoundary[] = [];
  districtSelect: IStateBoundary;
  districtId: number;
  villageItems: IStateBoundary[] = [];
  villageSelect: IStateBoundary;
  villageId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected postalAddressService: PostalAddressService,
    protected contactMechTypeService: ContactMechTypeService,
    protected purposeTypeService: PurposeTypeService,
    protected stateBoundaryService: StateBoundaryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(postalAddressService, messageService, elementRef, dataUtils, account, eventManager);
    this.countrySelect = new StateBoundary();
    this.provinceSelect = new StateBoundary();
    this.citySelect = new StateBoundary();
    this.districtSelect = new StateBoundary();
    this.villageSelect = new StateBoundary();
    this.item = new PostalAddress();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PostalAddress();
        this.postalAddressService.find(this.id).subscribe(result => {
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
    this.contactMechTypeService.loadCacheAll().subscribe((res: IContactMechType[]) => (this.contactmechtypes = res || []));

    this.purposeTypeService.loadCacheAll().subscribe((res: IPurposeType[]) => (this.purposetypes = res || []));

    this.stateBoundaryService.loadCacheAll().subscribe((res: IStateBoundary[]) => (this.stateboundaries = res || []));
  }

  prepareView() {
    if (this.postalAddress.countryId) {
      this.stateBoundaryService.find(this.postalAddress.countryId).subscribe(
        (value: HttpResponse<IStateBoundary>) => {
          this.countrySelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (this.postalAddress.provinceId) {
      this.stateBoundaryService.find(this.postalAddress.provinceId).subscribe(
        (value: HttpResponse<IStateBoundary>) => {
          this.provinceSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (this.postalAddress.cityId) {
      this.stateBoundaryService.find(this.postalAddress.cityId).subscribe(
        (value: HttpResponse<IStateBoundary>) => {
          this.citySelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (this.postalAddress.districtId) {
      this.stateBoundaryService.find(this.postalAddress.districtId).subscribe(
        (value: HttpResponse<IStateBoundary>) => {
          this.districtSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
    if (this.postalAddress.villageId) {
      this.stateBoundaryService.find(this.postalAddress.villageId).subscribe(
        (value: HttpResponse<IStateBoundary>) => {
          this.villageSelect = value.body;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    }
  }

  get postalAddress() {
    return this.item;
  }

  set postalAddress(postalAddress: IPostalAddress) {
    this.item = postalAddress;
  }

  trackContactMechTypeById(index: number, item: IContactMechType) {
    return item.id;
  }

  trackPurposeTypeById(index: number, item: IPurposeType) {
    return item.id;
  }

  searchcountry(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.countryItems = res.body;
    });
  }

  selectcountry(value: any) {
    this.item.countryId = this.countrySelect.id;
  }

  searchprovince(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.provinceItems = res.body;
    });
  }

  selectprovince(value: any) {
    this.item.provinceId = this.provinceSelect.id;
  }

  searchcity(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.cityItems = res.body;
    });
  }

  selectcity(value: any) {
    this.item.cityId = this.citySelect.id;
  }

  searchdistrict(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.districtItems = res.body;
    });
  }

  selectdistrict(value: any) {
    this.item.districtId = this.districtSelect.id;
  }

  searchvillage(event: any) {
    this.stateBoundaryService.search({ query: event.query + '*' }).subscribe((res: HttpResponse<IStateBoundary[]>) => {
      this.villageItems = res.body;
    });
  }

  selectvillage(value: any) {
    this.item.villageId = this.villageSelect.id;
  }

  itemKey() {
    return this.item.id;
  }

  getSelected(selectedVals: IPurposeType[], option: IPurposeType): IPurposeType {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
