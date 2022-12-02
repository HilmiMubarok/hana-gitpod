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
import { IPostalAddress } from '../postal-address/postal-address.model';
import { IPositionType, PositionType } from './position-type.model';
import { PositionTypeService } from './position-type.service';

@Component({
  selector: 'jhi-position-type-view',
  templateUrl: './position-type-view.component.html',
  styleUrls: ['./position-type.css'],
})
export class PositionTypeViewComponent extends AbstractEntityMaterialComponent<IPositionType> implements OnInit {
  public model: IPositionType;

  public filter: string;
  id: any;

  post: any = '';
  organizationData: any = '';

  constructor(
    private positionTypeService: PositionTypeService,
    private formBuilder: FormBuilder,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    protected messageService: MessageService,
    private applicationStateLogService: ApplicationStateLogService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(_snackBar, positionTypeService);
  }

  ngOnInit(): void {
    this.model = new PositionType();

    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadDataAll(this.id);
  }

  loadDataAll(id) {
    this.positionTypeService.find(id).subscribe(response => {
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

// import { IPositionType, PositionType } from './position-type.model';
// import { PositionTypeService } from './position-type.service';
// import { MessageService } from 'primeng/api';
// import { AccountService } from 'app/core/auth/account.service';
// import { CODE } from 'app/shared/constants/base.constants';
// import { AbstractEntityBaseViewComponent } from 'app/shared/base/abstract-entity-view.component';
// import { TranslateService } from '@ngx-translate/core';
// import { IInternalType, InternalType } from 'app/entities/internal-type/internal-type.model';
// import { InternalTypeService } from 'app/entities/internal-type/internal-type.service';

// type SelectableEntity = IPositionType | IInternalType;

// @Component({
//   selector: 'jhi-position-type-view',
//   templateUrl: './position-type-view.component.html',
// })
// export class PositionTypeViewComponent extends AbstractEntityBaseViewComponent<IPositionType> implements OnChanges {
//   @Input() id: string;
//   readonly CODE: typeof CODE = CODE;

//   positiontypes: IPositionType[] = [];

//   internaltypes: IInternalType[] = [];
//   parentId: string;
//   internalTypeId: string;

//   constructor(
//     protected dataUtils: BaseDataUtils,
//     protected alertService: AlertService,
//     protected positionTypeService: PositionTypeService,
//     protected internalTypeService: InternalTypeService,
//     protected elementRef: ElementRef,
//     protected activatedRoute: ActivatedRoute,
//     protected messageService: MessageService,
//     protected translateService: TranslateService,
//     protected eventManager: EventManager,
//     public account: AccountService
//   ) {
//     super(positionTypeService, messageService, elementRef, dataUtils, account, eventManager);
//     this.item = new PositionType();
//   }

//   ngOnChanges(changes: SimpleChanges) {
//     if (changes['id']) {
//       if (changes['id'].isFirstChange()) {
//         this.initialize();
//       }
//       if (this.id) {
//         this.item = new PositionType();
//         this.positionTypeService.find(this.id).subscribe(result => {
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
//     this.positionTypeService.loadCacheAll().subscribe((res: IPositionType[]) => (this.positiontypes = res || []));

//     this.internalTypeService.loadCacheAll().subscribe((res: IInternalType[]) => (this.internaltypes = res || []));
//   }

//   prepareView() {}

//   get positionType() {
//     return this.item;
//   }

//   set positionType(positionType: IPositionType) {
//     this.item = positionType;
//   }

//   trackPositionTypeById(index: number, item: IPositionType) {
//     return item.id;
//   }

//   trackInternalTypeById(index: number, item: IInternalType) {
//     return item.id;
//   }

//   itemKey() {
//     return this.item.id;
//   }
// }
