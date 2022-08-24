import { Component, OnChanges, SimpleChanges, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IPerson, Person } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IPartyType } from 'app/entities/party-type/party-type.model';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { IPostalAddress, PostalAddress } from 'app/entities/postal-address/postal-address.model';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IReligionType } from 'app/entities/religion-type/religion-type.model';
import { ReligionTypeService } from 'app/entities/religion-type/religion-type.service';
import { IWorkType } from 'app/entities/work-type/work-type.model';
import { WorkTypeService } from 'app/entities/work-type/work-type.service';

import { ICif, Cif } from '../cif/cif.model';
import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address/party-postal-address.model';
import { IFinServiceAccount, FinServiceAccount } from '../fin-service-account/fin-service-account.model';

// library
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MasterInitialDebtorDataService } from '../master-initial-debtor-data/master-initial-debtor-data.service';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { HttpResponse } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import _ from 'lodash';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
moment.locale('id');

@Component({
  selector: 'jhi-collateral-appraisal-person-view',
  templateUrl: './collateral-appraisal-person-view.component.html',
  styleUrls: ['./collateral-appraisal-person-view.css'],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'id',
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CollateralAppraisalPersonViewComponent extends AbstractEntityBaseViewComponent<IPerson> implements OnChanges, OnInit {
  @Input()
  public disableMaritalStatus: Boolean = false;

  @Output()
  public selectMaritalStatus: EventEmitter<IOptionNode> = new EventEmitter<IOptionNode>();

  readonly CODE: typeof CODE = CODE;
  public maxDate: Date = new Date();
  public fields: Object = { text: 'description', value: 'id' };
  public fieldsOptionNode: Object = { text: 'label', value: 'id' };

  public bloodTypes: IOptionNode[];
  public maritalStatuses: IOptionNode[];
  public genders: IOptionNode[];

  public cif?: ICif;
  public partyPostalAddress?: IPartyPostalAddress;
  public postalAddress?: IPostalAddress;
  public accountFin?: FinServiceAccount;

  // icon
  faSearch = faSearch;

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
    private masterInitialDebtorDataService: MasterInitialDebtorDataService,
    public account: AccountService
  ) {
    super(personService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Person();

    this.cif = new Cif();
    this.partyPostalAddress = new PartyPostalAddress();
    this.postalAddress = new PostalAddress();
    this.partyPostalAddress.address = this.postalAddress;
    this.accountFin = new FinServiceAccount();

    this.cif.addresses.push(this.partyPostalAddress);
    this.cif.accounts.push(this.accountFin);
  }

  ngOnInit(): void {
    this.masterInitialDebtorDataService.getMaritalStatus().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.maritalStatuses = res.body;
    });

    this.personService.getBloodTypes().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.bloodTypes = res.body;
    });

    this.personService.getGenders().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.genders = res.body;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes @ngOnChanges person : ', changes);
    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.initialize();
      }

      this.item.dob = this.item.dob != null ? new Date(this.item.dob) : null;
      if (this.item.attributes['fronTitle'] === undefined) {
        this.item.attributes['fronTitle'] = '';
      }

      if (this.item.attributes['backTitle'] === undefined) {
        this.item.attributes['backTitle'] = '';
      }

      if (this.item.attributes['identityLifetime'] === undefined) {
        this.item.attributes['identityLifetime'] = true;
      }

      if (this.item.attributes['identityExpiredDate'] === undefined) {
        this.item.attributes['identityExpiredDate'] = new Date();
      }

      if (this.item.attributes['sid'] === undefined) {
        this.item.attributes['sid'] = '';
      }

      if (this.item.attributes['sidCode'] === undefined) {
        this.item.attributes['sidCode'] = '';
      }

      if (this.item.attributes['lbuCode'] === undefined) {
        this.item.attributes['lbuCode'] = '';
      }

      if (this.item.attributes['lbuRemark'] === undefined) {
        this.item.attributes['lbuRemark'] = '';
      }
    }

    if (changes['cif']) {
      if (changes['cif'].isFirstChange()) {
        // Do nothing
      } else {
        console.log('changes @ngOnChanges collateral-appraisal-person-view : ', changes);
        // this.cif = changes['cif'];
      }
    }
    console.log('this.cif @ngOnChanges collateral-appraisal-person-view : ', this.cif);
  }

  public updateModel(): void {
    this.selectMaritalStatus.emit(_.find(this.maritalStatuses, { id: this.item.maritalStatus }));
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
