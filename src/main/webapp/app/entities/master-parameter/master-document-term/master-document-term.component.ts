import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MasterDocumentTermService } from './master-document-term.service';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { IMasterCompanyType, MasterCompanyType } from '../master-company-type/master-company-type.model';
import { MasterCompanyTypeService } from '../master-company-type/master-company-type.service';
import { MasterDocumentTermDialogComponent } from './master-document-term-dialog.component';

@Component({
  selector: 'jhi-master-document-term',
  template: `
    <div class="row remove-row-scroll">
      <div class="e-card">
        <div class="e-card-header">
          <div class="e-card-header-caption">
            <ejs-breadcrumb cssClass="margin: 1rem;">
              <e-breadcrumb-items>
                <e-breadcrumb-item iconCss="e-icons e-home" url="/"></e-breadcrumb-item>
                <e-breadcrumb-item text="Document Term" url="/master-document-term"> </e-breadcrumb-item>
              </e-breadcrumb-items>
            </ejs-breadcrumb>
            <div class="header-container">
              <div class="header-content">
                <img class="back-image" src="../../../content/images/back-icon.svg" (click)="previousState()" />
                <span class="back-prefix" (click)="previousState()">Back | </span>
              </div>
              <p class="e-card-sub-title">Document Term</p>
            </div>
          </div>
        </div>
        <mat-card *ngIf="isLoading | async" id="material-loading-bar">
          <mat-spinner color="warn" mode="indeterminate"> </mat-spinner>
        </mat-card>
        <mat-card style="margin: 1rem" [hidden]="isLoading | async">
          <table mat-table [dataSource]="items" class="w-100">
            <ng-container matColumnDef="no">
              <th mat-header-cell *matHeaderCellDef width="5%" class="rounding-table-left grid-index-right">No</th>
              <td mat-cell *matCellDef="let element; let i = index" class="grid-index-right">
                {{ i + 1 + paginator.pageIndex * paginator.pageSize }}.
              </td>
            </ng-container>

            <ng-container matColumnDef="code">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left">Code</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">{{ element.code }}</td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left">Name</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">{{ element.name }}</td>
            </ng-container>
            <ng-container matColumnDef="abbreviation">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left">Abbreviation</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">{{ element.abbreviation }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left">Status</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">{{ element.statusId }}</td>
            </ng-container>
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef class="grid-index-left rounding-table-right">Action</th>
              <td mat-cell *matCellDef="let element" class="grid-index-left text-capitalize">
                <button mat-icon-button (click)="openDialog(element)">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" [attr.colspan]="displayColumns.length">No records found.</td>
            </tr>
            <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
            <tr mat-row *matRowDef="let element; columns: displayColumns"></tr>
          </table>
          <mat-paginator
            showFirstLastButtons
            ngClass="transparant"
            [length]="paginatorLength"
            [pageSize]="paginatorPageSize"
            [pageSizeOptions]="paginatorPageSizeOption"
            (page)="loadDataLazy($event)"
          >
          </mat-paginator>
        </mat-card>
        <!-- <div class="e-card-actions">
      <div class="d-flex justify-content-center mb-3 mt-3">
        <button mat-raised-button (click)="openDialog()" class="button-styling">ADD</button>
      </div>
    </div> -->
      </div>
    </div>
  `,
  styleUrls: ['../master-company-type/master-company-type.css'],
})
export class MasterDocumentTermComponent extends AbstractEntityMaterialComponent<IMasterCompanyType> implements OnInit, OnDestroy {
  constructor(
    protected _snackbar: MatSnackBar,
    protected masterDocumentTermService: MasterDocumentTermService,
    protected dialog: MatDialog,
    protected masterCompanyTypeService: MasterCompanyTypeService
  ) {
    super(_snackbar, masterDocumentTermService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading: Observable<boolean> = this.loading$.asObservable();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private loadAll(): void {
    this.loadCompanyType();
    // this.loadDocumentTerm();
  }

  previousState(): void {
    window.history.back();
  }

  public openDialog(element: IMasterCompanyType = null): void {
    let predicate: IMasterCompanyType;
    predicate = new MasterCompanyType();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterDocumentTermDialogComponent, {
      width: '100%',
      data: {
        masterCompanyType: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IMasterCompanyType) => {
      if (res) {
        if (res.id) {
          this.masterCompanyTypeService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.masterCompanyTypeService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  loadDocumentTerm(): void {
    this.masterDocumentTermService
      .getMasterDocumentTerm()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.items = new MatTableDataSource(res);
        console.log('Res', { res, item: this.items, pag: this.paginator });
        this.items.paginator = this.paginator;
      });
  }

  loadCompanyType(): void {
    this.loading$.next(true);
    this.masterCompanyTypeService
      .query({
        page: 0,
        size: 9999,
        sort: this.sortData(),
      })
      .subscribe({
        next: res => {
          const data = res.body || [];
          this.items = new MatTableDataSource(data);
          console.log('Data', { data, res, item: this.items, pag: this.paginator });

          this.items.paginator = this.paginator;
          this.loading$.next(false);
        },
        error: () => {
          this.loading$.next(false);
        },
        complete: () => {
          this.loading$.next(false);
        },
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public displayColumns: string[] = ['no', 'code', 'name', 'abbreviation', 'status', 'action'];
}
