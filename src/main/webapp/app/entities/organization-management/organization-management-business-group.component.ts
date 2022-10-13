import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { OrganizationManagementBusinessGroupDialogComponent } from './organization-management-business-group-dialog.component';
import { IOrganizationManagement, OrganizationManagement } from './organization-management.model';
import { OrganizationManagementService } from './organization-management.service';

@Component({
  selector: 'jhi-organization-management-business-group',
  templateUrl: './organization-management-business-group.component.html',
})
export class OrganizationManagementBusinessGroupComponent
  extends AbstractEntityMaterialComponent<IOrganizationManagement>
  implements OnChanges
{
  @Input() public cif: string;

  get dataSource() {
    return this.items;
  }
  set dataSource(param: IOrganizationManagement[]) {
    this.items = param;
  }

  public displayedColumns: string[] = ['no', 'name', 'npwp', 'cif', 'address', 'action'];
  constructor(
    protected _snackbar: MatSnackBar,
    protected organizationManagementService: OrganizationManagementService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, organizationManagementService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cif']) {
      this.loadAll(this.cif);
    }
  }

  private loadAll(cif: string): void {
    this.organizationManagementService
      .queryFilterBy({
        cifNumber: this.cif,
        organizationManagementType: 'BUSINESS_GROUP',
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
    this.loadAll(this.cif);
  }

  public openDialog(element: IOrganizationManagement = null): void {
    let value: IOrganizationManagement;
    value = new OrganizationManagement();
    value.cifNumber = this.cif;
    if (element) {
      value = element;
    }

    const dialogRef = this.dialog.open(OrganizationManagementBusinessGroupDialogComponent, {
      width: '80vw',
      data: {
        organizationManagement: value,
        view: element ? true : false,
      },
    });
    dialogRef.afterClosed().subscribe((res: IOrganizationManagement) => {
      if (res && !res.id) {
        res.organizationManagementTypeId = 'BUSINESS_GROUP';
        res.person = null;
        this.organizationManagementService.create(res).subscribe(res2 => {
          this.loadAll(this.cif);
        });
      }
    });
  }
}
