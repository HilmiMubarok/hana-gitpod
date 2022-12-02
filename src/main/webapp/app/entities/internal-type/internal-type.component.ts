import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// import { IPartner } from './partner.model';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
// import { PartnerService } from './partner.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationStateLogService } from '../application-state-log/application-state-log.service';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ReportUtilService } from 'app/shared/base/report-util.service';
import { IInternalType } from './internal-type.model';
import { InternalTypeService } from './internal-type.service';

@Component({
  selector: 'jhi-internal-type',
  templateUrl: './internal-type.component.html',
  styleUrls: ['./internal-type.css'],
})
export class InternalTypeComponent extends AbstractEntityMaterialComponent<IInternalType> implements OnInit {
  public displayedColumns: string[] = ['no', 'id', 'description', 'parentDescription', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  constructor(
    private internalTypeService: InternalTypeService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected reportUtils: ReportUtilService
  ) {
    super(_snackBar, internalTypeService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
  }

  ngOnInit(): void {
    // this.activatedRoute.data.subscribe(({ partner }) => (this.partner = partner));
    this.loadAll();
    // console.log("hahah");
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;

    this.internalTypeService
      // .query({
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IInternalType[]>) => {
          console.log('res', res);
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }
}

// import { Component } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AccountService } from 'app/core/auth/account.service';
// import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
// import { IInternalType } from './internal-type.model';
// import { InternalTypeService } from './internal-type.service';
// import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
// import { AbstractEntityComponent } from 'app/shared/base/abstract-entity.component';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { BaseDataUtils } from 'app/shared/base/base-data-utils.service';
// import { ParseLinks } from 'app/core/util/parse-links.service';
// import { AlertService } from 'app/core/util/alert.service';
// import { EventManager } from 'app/core/util/event-manager.service';

// @Component({
//   selector: 'jhi-internal-type',
//   templateUrl: './internal-type.component.html',
// })
// export class InternalTypeComponent extends AbstractEntityComponent<IInternalType> {
//   constructor(
//     protected internalTypeService: InternalTypeService,
//     protected parseLinks: ParseLinks,
//     protected alertService: AlertService,
//     public accountService: AccountService,
//     protected activatedRoute: ActivatedRoute,
//     protected dataUtils: BaseDataUtils,
//     protected router: Router,
//     protected eventManager: EventManager,
//     protected messageService: MessageService,
//     protected modalService: NgbModal,
//     protected confirmationService: ConfirmationService
//   ) {
//     super(
//       internalTypeService,
//       parseLinks,
//       accountService,
//       activatedRoute,
//       dataUtils,
//       router,
//       eventManager,
//       messageService,
//       confirmationService
//     );

//     this.parentRoute = '/internal-type';
//     this.listChangeEventName = 'internalTypeListModification';
//     this.entityKeyName = 'id';

//     this.routeData = this.activatedRoute.data.subscribe(data => {
//       this.page = data.pagingParams.page;
//       this.previousPage = data.pagingParams.page;
//       this.reverse = data.pagingParams.ascending;
//       this.predicate = data.pagingParams.predicate;
//       activatedRoute.queryParams.subscribe(params => {
//         this.itemsPerPage = params['size'] || ITEMS_PER_PAGE;
//         this.first = (this.page - 1) * this.itemsPerPage || 0;
//       });
//     });
//     this.currentSearch =
//       this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
//   }

//   trackId(index: number, item: IInternalType) {
//     return item.id;
//   }

//   get internalTypes() {
//     return this.items;
//   }

//   set internalTypes(internalType: IInternalType[]) {
//     this.items = internalType;
//   }
// }
