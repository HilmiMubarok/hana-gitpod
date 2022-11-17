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
import { InternalService } from './internal.service';
import { IInternal } from './internal.model';

@Component({
  selector: 'jhi-internal',
  templateUrl: './internal.component.html',
  styleUrls: ['./internal.css'],
})
export class InternalComponent extends AbstractEntityMaterialComponent<IInternal> implements OnInit {
  public displayedColumns: string[] = ['no', 'name', 'officePhone', 'address1', 'statusDescription', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  public clickedChip: Object;
  public iconTimeline: any;

  // constructor(protected activatedRoute: ActivatedRoute, private toastService: MessageService) {}

  constructor(
    private internalService: InternalService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService
  ) {
    super(_snackBar, internalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'createdDate';
    this.entityKeyName = 'createdDate';
    this.clickedChip = {
      id: '',
      label: '',
    };
    this.iconTimeline = faTimeline;
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

    this.internalService
      // .query({
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: (res: HttpResponse<IInternal[]>) => {
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
