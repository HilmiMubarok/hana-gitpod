import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
import { AlertService } from 'app/core/util/alert.service';
import { EventManager } from 'app/core/util/event-manager.service';

import { ICollateral, Collateral } from './collateral.model';
import { CollateralService } from './collateral.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'app/core/auth/account.service';
import { CODE } from 'app/shared/constants/base.constants';
import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
import { TranslateService } from '@ngx-translate/core';
import { ICollateralType, CollateralType } from 'app/entities/collateral-type/collateral-type.model';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { IParty, Party } from 'app/entities/party/party.model';
import { PartyService } from 'app/entities/party/party.service';
import { IApplication, Application } from 'app/entities/application/application.model';
import { ApplicationService } from 'app/entities/application/application.service';
import { faSearch, faFileImage, faEye } from '@fortawesome/free-solid-svg-icons';
import lodash from 'lodash';

type SelectableEntity = ICollateralType | IParty | IApplication;

@Component({
  selector: 'jhi-collateral-view',
  templateUrl: './collateral-view.component.html',
  styleUrls: ['./css/collateral-view.css'],
})
export class CollateralViewComponent extends AbstractEntityBaseViewComponent<ICollateral> implements OnChanges {
  @Input()
  public misc: string;

  @Input()
  public type: string;

  @Input() id: number;
  readonly CODE: typeof CODE = CODE;

  collateraltypes: ICollateralType[] = [];

  parties: IParty[] = [];

  applications: IApplication[] = [];
  collateralTypeId: string;
  partyId: string;
  applicationId: number;

  public selectionObjectEnv: object[] = [];
  public objectEnvironments: object[] = [
    { id: 'housingComplex', label: 'Housing Complex', select: false },
    { id: 'looseSettlement', label: 'Loose Settlement', select: false },
    { id: 'officeComplex', label: 'Office Complex', select: false },
    { id: 'commercialArea', label: 'Commercial Area', select: false },
    { id: 'warehousingArea', label: 'Warehousing Area', select: false },
  ];
  public listOfValues: object = {
    property_usage: [
      'Rumah Tinggal',
      'Ruko/Rukan',
      'Apartmen',
      'Office Space',
      'Kios',
      'Pabrik',
      'Gudang',
      'Tanah/Kavling',
      'Kendaraan',
      'Alat Berat',
      'Lainnya',
    ],
    land_shape: ['Beraturan', 'Tidak beraturan', 'Trapesium', 'Segitiga', 'Lainnya'],
    made_with: ['Aspal', 'Beton', 'Pavling', 'Tanah', 'Sirtu (Pasir Batu)', 'Lainnya'],
  };

  constructor(
    protected dataUtils: BaseDataUtils,
    protected alertService: AlertService,
    protected collateralService: CollateralService,
    protected collateralTypeService: CollateralTypeService,
    protected partyService: PartyService,
    protected applicationService: ApplicationService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected messageService: MessageService,
    protected translateService: TranslateService,
    protected eventManager: EventManager,
    public account: AccountService
  ) {
    super(collateralService, messageService, elementRef, dataUtils, account, eventManager);
    this.item = new Collateral();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id']) {
      if (changes['id'].isFirstChange()) {
        throw new Error('Nothing');
      }
      if (this.id) {
        this.item = new Collateral();
        this.collateralService.find(this.id).subscribe(result => {
          this.item = result.body;
          this.prepareView();
        });
      }
    }

    if (changes['item']) {
      if (changes['item'].isFirstChange()) {
        this.prepareView();
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
    this.collateralTypeService.loadCacheAll().subscribe((res: ICollateralType[]) => (this.collateraltypes = res || []));

    this.partyService.loadCacheAll().subscribe((res: IParty[]) => (this.parties = res || []));

    this.applicationService.loadCacheAll().subscribe((res: IApplication[]) => (this.applications = res || []));
  }

  public selectObjectEnvironment(checked: boolean, data: object): void {
    const idx: number = lodash.findIndex(this.selectionObjectEnv, function (o) {
      return o['id'] === data['id'];
    });
    if (checked) {
      this.selectionObjectEnv[idx]['select'] = true;
    } else {
      this.selectionObjectEnv[idx]['select'] = false;
    }
    this.item.objEnvironment = JSON.stringify(this.selectionObjectEnv);
  }

  prepareView() {
    if (this.item.objEnvironment === null) {
      this.selectionObjectEnv = lodash.clone(this.objectEnvironments);
    } else {
      this.selectionObjectEnv = JSON.parse(this.item.objEnvironment);
    }
  }

  get collateral() {
    return this.item;
  }

  set collateral(collateral: ICollateral) {
    this.item = collateral;
  }

  trackCollateralTypeById(index: number, item: ICollateralType) {
    return item.id;
  }

  trackPartyById(index: number, item: IParty) {
    return item.id;
  }

  trackApplicationById(index: number, item: IApplication) {
    return item.id;
  }

  itemKey() {
    return this.item.id;
  }

  public fieldCollateralType: object = { text: 'nameType', value: 'id' };
  public dataCollateralType: object[] = [
    { id: 1, nameType: 'Deposit' },
    { id: 2, nameType: 'Others' },
    { id: 3, nameType: 'Securities' },
    { id: 4, nameType: 'Stand by L/C' },
    { id: 5, nameType: 'Personal Properties' },
    { id: 6, nameType: 'Real Estate' },
  ];

  public fieldRealEstate: object = { text: 'name', value: 'id' };
  public dataRealEstate: object[] = [{ id: 1, name: 'Real Estate' }];
  public value: String = 'Real Estate';

  public deposit = { id: 1, nameType: 'Deposit' };
  public others = { id: 2, nameType: 'Others' };
  public securities = { id: 3, nameType: 'Securities' };
  public standByLc = { id: 4, nameType: 'Stand by L/C' };
  public personal = { id: 5, nameType: 'Personal Properties' };
  public realEstate = { id: 6, nameType: 'Real Estate' };

  public kondisi = this.realEstate.id;

  public cssClass: String = 'e-outline';
  faSearch = faSearch;
  faFileImage = faFileImage;
  faEye = faEye;

  public data: object[] = [
    {
      no: 1,
      document_date: '2001-04-06',
      no_document: '313213',
      document_guarantee: 'sertifikat',
      upload_by: 'setya',
      document_upload: 'svg',
    },
    {
      no: 2,
      document_date: '2001-04-06',
      no_document: '1321312',
      document_guarantee: 'sertifikat',
      upload_by: 'setya',
      document_upload: 'svg',
    },
  ];
}
