import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { OrganizationLegalDialogComponent } from './organization-legal-dialog.component';
import { IOrganizationLegal, OrganizationLegal } from './organization-legal.model';
import { OrganizationLegalService } from './organization-legal.service';

@Component({
  selector: 'jhi-organization-legal-list',
  templateUrl: './organization-legal-list.component.html',
})
export class OrganizationLegalListComponent extends AbstractEntityMaterialComponent<IOrganizationLegal> implements OnChanges {
  @Input() public organizationId: string;

  @Input()
  get dataSource() {
    return this.items;
  }
  set dataSource(param: IOrganizationLegal[]) {
    this.items = param;
  }

  @Input() deedNumber;
  @Input() deedDates;

  public displayedColumns: string[] = ['no', 'deedEstablishNo', 'deedEstablishDate', 'action'];

  constructor(protected organizationLegalService: OrganizationLegalService, protected _snackBar: MatSnackBar, public dialog: MatDialog) {
    super(_snackBar, organizationLegalService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['organizationId']) {
      this.loadDataBy(this.organizationId);
    }
  }

  public loadDataBy(_idOrganization: string = null): void {
    this.organizationLegalService
      .queryFilterBy({
        idOrganization: _idOrganization,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id,desc'],
      })
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadDataBy(this.organizationId);
  }

  public openDialogDelete(param: IOrganizationLegal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '80vw',
      data: {
        title: 'Confirmation Delete Organization Legal',
        message: 'Are you sure to delete this data?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.organizationLegalService.delete(param.id).subscribe(res2 => {
          this.loadDataBy(this.organizationId);
        });
      }
    });
  }

  public openDialog(param: IOrganizationLegal = null): void {
    let value: IOrganizationLegal;
    value = new OrganizationLegal();
    value.organizationId = this.organizationId;
    if (param) {
      value = param;
    }

    const dialogRef = this.dialog.open(OrganizationLegalDialogComponent, {
      width: '80vw',
      data: {
        organizationLegal: value,
        deedNumber: this.deedNumber,
        deedDates: this.deedDates,
      },
    });
    dialogRef.afterClosed().subscribe((res: IOrganizationLegal) => {
      if (res) {
        if (res.id) {
          // update
          this.organizationLegalService.update(res).subscribe(res2 => {
            this.loadDataBy(this.organizationId);
          });
        } else {
          // create
          this.organizationLegalService.create(res).subscribe(res2 => {
            this.loadDataBy(this.organizationId);
          });
        }
      }
    });
  }

  public isFromH(element: IOrganizationLegal) {
    if (element.dataSource === 'h' || element.dataSource === 'H') {
      return true;
    }
    return false;
  }
}
