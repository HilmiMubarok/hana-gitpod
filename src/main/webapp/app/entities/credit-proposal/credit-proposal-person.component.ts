import { Component, OnChanges, SimpleChanges, ElementRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { Person, IPerson } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { PartyTypeService } from 'app/entities/party-type/party-type.service';
import { PostalAddressService } from 'app/entities/postal-address/postal-address.service';
import { IReligionType } from 'app/entities/religion-type/religion-type.model';
import { ReligionTypeService } from 'app/entities/religion-type/religion-type.service';
import { IWorkType } from 'app/entities/work-type/work-type.model';
import { WorkTypeService } from 'app/entities/work-type/work-type.service';

// library
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MasterInitialDebtorDataService } from '../master-initial-debtor-data/master-initial-debtor-data.service';
import { IOptionNode } from 'app/shared/model/option-node.model';
import { HttpResponse } from '@angular/common/http';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import _ from 'lodash';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ICreditProposal } from './credit-proposal.model';
moment.locale('id');

@Component({
  selector: 'jhi-credit-proposal-person',
  templateUrl: './credit-proposal-person.component.html',
  styleUrls: ['./css/credit-proposal-basic-information.css'],
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
export class CreditProposalPersonComponent extends AbstractEntityBaseViewComponent<IPerson> implements OnChanges, OnInit {
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
  private _deptorData: ICreditProposal;

  @Input()
  get deptorData() {
    return this._deptorData;
  }

  set deptorData(deptor: ICreditProposal) {
    this._deptorData = deptor;
  }
  // icon
  faSearch = faSearch;

  religiontypes: IReligionType[] = [];
  worktypes: IWorkType[] = [];
  partyTypeId: string;
  postalAddressId: number;
  religionTypeId: string;
  workTypeId: string;

  public collectabilityStatusData = ['1', '2', '3', '4', '5'];
  public ifcRiskCategoryData = ['Low', 'Medium', 'High'];
  public categoryDebitur = ['70', '80', '90', '99'];
  public umkm = ['micro', 'small', 'intermediate', 'high'];
  public report = ['Green', 'Yellow/Early Warning Debtor', 'Red/Wa'];

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
    if (changes['_deptorData']) {
      console.log('Deptor data Changes');
    }
  }

  public updateModel(): void {
    this.selectMaritalStatus.emit(_.find(this.maritalStatuses, { id: this.item.maritalStatus }));
  }

  initialize() {
    this.religionTypeService.loadCacheAll().subscribe((res: IReligionType[]) => (this.religiontypes = res || []));
    this.workTypeService.loadCacheAll().subscribe((res: IWorkType[]) => (this.worktypes = res || []));
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
