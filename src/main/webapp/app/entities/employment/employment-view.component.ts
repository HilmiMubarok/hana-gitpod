import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { IEmployment, Employment } from './employment.model';
import { EmploymentService } from './employment.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { IRelationType, RelationType } from 'app/entities/relation-type/relation-type.model';
import { RelationTypeService } from 'app/entities/relation-type/relation-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { viewport } from '@popperjs/core';
import { IWorkType, WorkType } from '../work-type/work-type.model';
import { WorkTypeService } from '../work-type/work-type.service';
import { workTypeRoute } from '../work-type/work-type.route';
import { MasterInitialDebtorDataService } from '../master-initial-debtor-data/master-initial-debtor-data.service';
import { IOptionNode } from 'app/shared/model/option-node.model';

type SelectableEntity = IRelationType | IParty;

@Component({
  selector: 'jhi-employment-view',
  templateUrl: './employment-view.component.html',
})
export class EmploymentViewComponent extends AbstractEntityBaseViewComponent<IEmployment> implements OnChanges {
  @Input() id: number;
  readonly CODE: typeof CODE = CODE;
  public sourceIncome: IOptionNode[];
  public purposeSourceIncome: IOptionNode[];
  public position: IOptionNode[];
  public lineOfBusiness: IOptionNode[];
  public sourceIncomeField: object = { text: 'label', value: 'id' };
  public purposeSourceIncomeField: object = { text: 'label', value: 'id' };
  public positionField: object = { text: 'label', value: 'id' };
  public lineOfBusinessField: object = { text: 'label', value: 'id' };

  relationtypes: IRelationType[] = [];

  parties: IParty[] = [];
  relationTypeId: string;
  partyToId: string;
  partyFromId: string;

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected employmentService: EmploymentService,
    protected relationTypeService: RelationTypeService,
    protected partyService: PartyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService,
    private masterService: MasterInitialDebtorDataService
  ) {
    super(employmentService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Employment();
  }

  ngOnInit(): void {
    this.getSourceIncome();
    this.getPurposeSourceIncome();
    this.getPosition();
    this.getLineOfBusiness();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        this.initialize();
      }
      if (this.id) {
        this.item = new Employment();
        this.employmentService.find(this.id).subscribe(result => {
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
    this.relationTypeService.loadCacheAll().subscribe((res: IRelationType[]) => (this.relationtypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    // this.workTypeService.loadCacheAll().subscribe((res: IWorkType[]) => (this.workType = res || []));
  }

  prepareView() {}

  get employment() {
    return this.item;
  }

  set employment(employment: IEmployment) {
    this.item = employment;
  }

  trackRelationTypeById(index: number, item: IRelationType) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }

  public workType: IWorkType[] = new Array<IWorkType>();
  public workTypeFields: Object = { text: 'description', value: 'id' };

  getWork(): void {
    /* this.workTypeService.query().subscribe((res: HttpResponse<IWorkType[]>) => {
      this.workType = res.body;
    });*/
  }

  private getSourceIncome(): void {
    this.masterService.getSourceIncome().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.sourceIncome = res.body;
    });
  }

  private getPurposeSourceIncome(): void {
    this.masterService.getPurposeSourceIncome().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.purposeSourceIncome = res.body;
    });
  }

  private getPosition(): void {
    this.masterService.getPosition().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.position = res.body;
    });
  }

  private getLineOfBusiness(): void {
    this.masterService.getLineOfBusiness().subscribe((res: HttpResponse<IOptionNode[]>) => {
      this.lineOfBusiness = res.body;
    });
  }
}
