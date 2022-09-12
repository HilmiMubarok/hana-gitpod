import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPartyGroup, PartyGroup } from './party-group.model';
import { PartyGroupService } from './party-group.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';

type SelectableEntity = IPartyType | IPostalAddress;

@Component({
  selector: 'jhi-party-group-view',
  templateUrl: './party-group-view.component.html',
  styleUrls: ['./party-group-view.css'],
})
export class PartyGroupViewComponent extends AbstractEntityBaseViewComponent<IPartyGroup> implements OnChanges {
  public partyGroupModel: IPartyGroup = new PartyGroup();
  @Input() id: string;
  readonly CODE: typeof CODE = CODE;

  partytypes: IPartyType[] = [];

  public corpOprDivs: object[] = [
    {
      id: 'corp-opr-div-1',
      description: 'Corp Opr Div 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
  ];

  public lineOfBusiness: object[] = [
    {
      id: 'line-of-business-1',
      description: 'Line Of Business 1',
    },
    {
      id: 'line-of-business-2',
      description: 'Line Of Business 2',
    },
    {
      id: 'line-of-business-3',
      description: 'Line Of Business 3',
    },
    {
      id: 'line-of-business-4',
      description: 'Line Of Business 4',
    },
    {
      id: 'line-of-business-5',
      description: 'Line Of Business 5',
    },
  ];

  public businessTypes: object[] = [
    {
      id: 'CV',
      description: 'CV',
    },
    {
      id: 'PT',
      description: 'PT',
    },
  ];

  public identities: object[] = [
    {
      id: 'identity-1',
      description: 'Identity 1',
    },
    {
      id: 'identity-2',
      description: 'Identity 2',
    },
    {
      id: 'identity-3',
      description: 'Identity 3',
    },
    {
      id: 'identity-4',
      description: 'Identity 4',
    },
    {
      id: 'identity-5',
      description: 'Identity 5',
    },
  ];

  public peps: object[] = [
    {
      id: 'pep-1',
      description: 'PEP 1',
    },
    {
      id: 'pep-2',
      description: 'PEP 2',
    },
    {
      id: 'pep-3',
      description: 'PEP 3',
    },
    {
      id: 'pep-4',
      description: 'PEP 4',
    },
    {
      id: 'pep-5',
      description: 'PEP 5',
    },
  ];

  public riskProfiles: object[] = [
    {
      id: 'risk-profile-1',
      description: 'Risk Profile 1',
    },
    {
      id: 'risk-profile-2',
      description: 'Risk Profile 2',
    },
    {
      id: 'risk-profile-3',
      description: 'Risk Profile 3',
    },
    {
      id: 'risk-profile-4',
      description: 'Risk Profile 4',
    },
    {
      id: 'risk-profile-5',
      description: 'Risk Profile 5',
    },
  ];

  postaladdresses: IPostalAddress[] = [];
  partyTypeId: string;
  postalAddressId: number;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected partyGroupService: PartyGroupService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(partyGroupService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new PartyGroup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new PartyGroup();
        this.partyGroupService.find(this.id).subscribe(result => {
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
    this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));

    this.postalAddressService.loadCacheAll().subscribe((res: IPostalAddress[]) => (this.postaladdresses = res || []));
    console.log('console log data', this.item);
  }

  prepareView() {}

  get partyGroup() {
    return this.item;
  }

  set partyGroup(partyGroup: IPartyGroup) {
    this.item = partyGroup;
  }

  trackPartyTypeById(index: number, item: IPartyType) {
    return item.id;
  }

  trackPostalAddressById(index: number, item: IPostalAddress) {
    return item.id;
  }

  public data: string[] = ['Snooker', 'Tennis', 'Cricket', 'Football', 'Rugby'];

  saveData() {
    console.log(this.item);
    // this.partyGroupService.preSave(this.partyGroupModel);
  }

  itemKey() {
    return this.item.id;
  }
}
