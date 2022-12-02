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
  selector: 'jhi-internal-update-view',
  templateUrl: './internal-type-update.component.html',
  styleUrls: ['./internal-type.css'],
})
export class InternalTypeUpdateComponent extends AbstractEntityMaterialComponent<IInternalType> implements OnInit {
  public model: IInternalType;

  public filter: string;
  internaltypes: IInternalType[] = [];
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

    this.internalTypeService
      .query({
        page: 0,
        size: 999,
        // sort: ['id', 'asc'],
      })
      .subscribe(response => {
        console.log('response', response.body);
        this.internaltypes = response.body;
      });
  }

  previousState(): void {
    window.history.back();
  }

  submit(): void {
    console.log('this submit');
    this.internalTypeService.update(this.model).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      console.log('hasil put', res);

      if (res.body) {
        this.router.navigate(['/internal-type']);
      }
    });
  }
}

// import { Component, ElementRef } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { EventManager } from 'app/core/util/event-manager.service';
// import { AlertService } from 'app/core/util/alert.service';
// import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
// import { HttpResponse } from '@angular/common/http';

// import { IInternalType, InternalType } from './internal-type.model';
// import { InternalTypeService } from './internal-type.service';
// import { IPartyType, PartyType } from 'app/entities/party-type/party-type.model';
// import { PartyTypeService } from 'app/entities/party-type/party-type.service';
// import { AccountService } from 'app/core/auth/account.service';
// import { combineLatest, Observable, of } from 'rxjs';
// import { catchError, map, mergeMap, tap } from 'rxjs/operators';

// import { ConfirmationService, MessageService } from 'primeng/api';
// import { AbstractEntityUpdateComponent } from 'app/shared/base/abstract-entity-update.component';

// @Component({
//   selector: 'jhi-internal-type-update',
//   templateUrl: './internal-type-update.component.html',
// })
// export class InternalTypeUpdateComponent extends AbstractEntityUpdateComponent<IInternalType> {
//   intrTypes: IInternalType[] = [];
//   parentId: string;

//   constructor(
//     protected dataUtils: BaseDataUtils,
//     protected alertService: AlertService,
//     protected internalTypeService: InternalTypeService,
//     protected partyTypeService: PartyTypeService,
//     protected elementRef: ElementRef,
//     protected activatedRoute: ActivatedRoute,
//     protected confirmationService: ConfirmationService,
//     protected eventManager: EventManager,
//     protected toastService: MessageService,
//     protected accountService: AccountService
//   ) {
//     super(dataUtils, internalTypeService, elementRef, confirmationService, toastService, activatedRoute);
//     this.listChangeEventName = 'internalTypeListModification';
//   }

//   protected initialState(): any {
//     return { item: new InternalType(), tasks: [], id: undefined };
//   }

//   initialize() {
//     combineLatest([this.accountService.identity(), this.activatedRoute.queryParams]).subscribe(([account_, params]) => {
//       this.currentAccount = account_;

//       // Read Route Parameter
//       if (params['parentId']) {
//         this.parentId = params['parentId'];
//       }
//     });

//     this.internalTypeService.loadCacheAll().subscribe((res: IInternalType[]) => (this.intrTypes = res || []));
//   }

//   protected loadRelatedEntityEffect(state: any): Observable<any> {
//     const result = of(state);
//     return result;
//   }

//   protected buildDependencyEffect(state: any): Observable<any> {
//     return of(state);
//   }

//   protected prepareSaveEffect(state: any): Observable<any> {
//     return of(state);
//   }

//   trackInternalTypeById(index: number, item: IInternalType) {
//     return item.id;
//   }

//   itemKey() {
//     return this.stateSubject.getValue().item.id;
//   }

//   get internalType() {
//     return this.item;
//   }
// }
