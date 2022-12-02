import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
// import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';

import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { IInternalType, InternalType } from './internal-type.model';
import { InternalTypeService } from './internal-type.service';

@Component({
  selector: 'jhi-internal-type-view',
  templateUrl: './internal-type-view.component.html',
  styleUrls: ['./internal-type.css'],
})
export class InternalTypeViewComponent extends AbstractEntityMaterialComponent<IInternalType> implements OnInit {
  public model: IInternalType;

  public filter: string;
  id: any;

  post: any = '';
  organizationData: any = '';

  constructor(
    private internalTypeService: InternalTypeService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, internalTypeService);
  }

  ngOnInit(): void {
    this.model = new InternalType();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadDataAll(this.id);
  }

  loadDataAll(id) {
    this.internalTypeService.find(id).subscribe(response => {
      console.log('response detail', response.body);
      this.model = response.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

// import { Component, OnChanges, SimpleChanges, ElementRef, Input } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
// import { AlertService } from 'app/core/util/alert.service';
// import { EventManager } from 'app/core/util/event-manager.service';

// import { IInternalType, InternalType } from './internal-type.model';
// import { InternalTypeService } from './internal-type.service';
// import { MessageService } from 'primeng/api';
// import { AccountService } from 'app/core/auth/account.service';
// import { CODE } from 'app/shared/constants/base.constants';
// import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
// import { TranslateService } from '@ngx-translate/core';
// import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
// import { PartyTypeService } from 'app/entities/party-type/party-type.service';

// @Component({
//   selector: 'jhi-internal-type-view',
//   templateUrl: './internal-type-view.component.html',
// })
// export class InternalTypeViewComponent extends AbstractEntityBaseViewComponent<IInternalType> implements OnChanges {
//   @Input() id: string;
//   readonly CODE: typeof CODE = CODE;

//   partytypes: IPartyType[] = [];
//   parentId: string;

//   constructor(
//     protected dataUtils: BaseDataUtils,
//     protected alertService: AlertService,
//     protected internalTypeService: InternalTypeService,
//     protected partyTypeService: PartyTypeService,
//     protected elementRef: ElementRef,
//     protected activatedRoute: ActivatedRoute,
//     protected messageService: MessageService,
//     protected translateService: TranslateService,
//     protected eventManager: EventManager,
//     public account: AccountService
//   ) {
//     super(internalTypeService, messageService, elementRef, dataUtils, account, eventManager);
//     this.item = new InternalType();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['id']) {
//       if (changes['id'].isFirstChange()) {
//         this.initialize();
//       }
//       if (this.id) {
//         this.item = new InternalType();
//         this.internalTypeService.find(this.id).subscribe(result => {
//           this.item = result.body;
//           this.prepareView();
//         });
//       }
//     }

//     if (changes['item']) {
//       if (changes['item'].isFirstChange()) {
//         this.initialize();
//       }
//       if (this.item) {
//         this.prepareView();
//       }
//     }

//     if (changes['isSaving'] && this.item.id) {
//       if (this.isSaving) {
//         this.save();
//       }
//     }
//   }

//   initialize() {
//     this.partyTypeService.loadCacheAll().subscribe((res: IPartyType[]) => (this.partytypes = res || []));
//   }

//   prepareView() {}

//   get internalType() {
//     return this.item;
//   }

//   set internalType(internalType: IInternalType) {
//     this.item = internalType;
//   }

//   trackPartyTypeById(index: number, item: IPartyType) {
//     return item.id;
//   }

//   itemKey() {
//     return this.item.id;
//   }
// }
