import { Component, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPostalAddress, PostalAddress } from './postal-address.model';
import { PostalAddressService } from './postal-address.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { TranslateService } from '@ngx-translate/core';
import { ContactMechTypeService } from 'app/entities/contact-mech-type/contact-mech-type.service';
import { PurposeTypeService } from 'app/entities/purpose-type/purpose-type.service';
import { StateBoundaryService } from 'app/entities/state-boundary/state-boundary.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-postal-address-update',
  templateUrl: './postal-address-update.component.html',
})
export class PostalAddressUpdateComponent implements OnChanges {
  public postalAddress: IPostalAddress = new PostalAddress();

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
    protected confirmationService: ConfirmationService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    protected toastService: MessageService,
    public account: AccountService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  public submitPostalAddress(): void {
    console.log('postalAddress', this.postalAddress);
    this.postalAddressService.create(this.postalAddress).subscribe((res: HttpResponse<IPostalAddress>) => {
      console.log('result', res);
    });
  }
}
