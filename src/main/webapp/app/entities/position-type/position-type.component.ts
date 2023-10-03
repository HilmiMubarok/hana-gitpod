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
import { IPositionType } from './position-type.model';
import { PositionTypeService } from './position-type.service';

@Component({
  selector: 'jhi-position-type',
  templateUrl: './position-type.component.html',
  styleUrls: ['./position-type.css'],
})
export class PositionTypeComponent extends AbstractEntityMaterialComponent<IPositionType> implements OnInit {
  public displayedColumns: string[] = ['no', 'id', 'description', 'internalTypeDescription', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  public positionSearch = false;

  constructor(
    private positionTypeService: PositionTypeService,
    protected _snackBar: MatSnackBar,
    protected router: Router,
    public dialog: MatDialog,
    private applicationStateLogService: ApplicationStateLogService,
    protected reportUtils: ReportUtilService
  ) {
    super(_snackBar, positionTypeService);
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
    if (this.currentSearch === ' ' || this.currentSearch === undefined || this.currentSearch === null) {
      this.loadAll();
    } else {
      this.search();
    }
  }

  private loadAll(): void {
    this.loading = true;

    this.positionTypeService
      // .query({
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'asc'],
      })
      .subscribe({
        next: (res: HttpResponse<IPositionType[]>) => {
          console.log('res', res);
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
  }

  previousState(): void {
    window.history.back();
  }

  public search() {
    this.positionSearch = true;
    this.positionTypeService
      .positionSrc({
        page: this.page,
        keyName: this.currentSearch,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .pipe(map((res: HttpResponse<IPositionType[]>) => this.preLoad(res)))
      .subscribe({
        next: (res: HttpResponse<IPositionType[]>) => this.initDataForMatTable(res, res.headers),
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    return;
  }

  public closeSearch() {
    this.positionSearch = false;
    this.currentSearch = '';
    this.page = 0;
    this.itemsPerPage = 0;
    this.loadAll();
  }
}
