import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPerson, Person } from './person.model';
import { PersonService } from './person.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IReligionType } from 'app/entities/religion-type/religion-type.model';
import { ReligionTypeService } from 'app/entities/religion-type/religion-type.service';
import { IWorkType } from 'app/entities/work-type/work-type.model';
import { WorkTypeService } from 'app/entities/work-type/work-type.service';

type SelectableEntity = IPartyType | IPostalAddress | IReligionType | IWorkType;

@Component({
  selector: 'jhi-person-view',
  templateUrl: './person-view.component.html',
})
export class PersonViewComponent extends AbstractEntityBaseViewComponent<IPerson> implements OnChanges {

  readonly CODE: typeof CODE = CODE;

  religiontypes: IReligionType[] = [];
  worktypes: IWorkType[] = [];
  partyTypeId: string;
  postalAddressId: number;
  religionTypeId: string;
  workTypeId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected personService: PersonService,
    protected partyTypeService: PartyTypeService,
    protected postalAddressService: PostalAddressService,
    protected religionTypeService: ReligionTypeService,
    protected workTypeService: WorkTypeService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(personService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Person();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }
      this.item.dob = this.item.dob != null ? new Date(this.item.dob) : null;
    }
  }

  initialize() {
    this.religionTypeService.loadCacheAll().subscribe((res: IReligionType[]) => (this.religiontypes = res || []));
    this.workTypeService.loadCacheAll().subscribe((res: IWorkType[]) => (this.worktypes = res || []));
  }

  get person() {
    return this.item;
  }

  set person(person: IPerson) {
    this.item = person;
  }

  trackReligionTypeById(index: number, item: IReligionType) {
    return item.id;
  }

  trackWorkTypeById(index: number, item: IWorkType) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }

}
