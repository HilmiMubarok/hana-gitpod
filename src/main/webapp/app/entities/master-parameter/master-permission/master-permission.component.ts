import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MenuParameterService } from './menu-parameter/menu-parameter.service';
import { IMenuItem } from './menu-parameter/menu-parameter.model';
import { IPositionType } from 'app/entities/position-type/position-type.model';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { MasterPermissionService } from './master-permission.service';
import { IAppMenuPermission } from './master-permission.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-master-permission',
  templateUrl: './master-permission.component.html',
  styleUrls: ['./master-permission.style.css'],
})
export class MasterPermissionComponent extends AbstractEntityMaterialComponent<IAppMenuPermission> implements OnInit {
  public displayColumns: string[] = ['no', 'menuDescription', 'positionDescription', 'status', 'action'];
  public listMenuItem: IMenuItem[];
  public listPositionType: IPositionType[];
  private menuItemId = '';
  private positionTypeId = '';
  constructor(
    protected _snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected menuParameterService: MenuParameterService,
    protected positionTypeService: PositionTypeService,
    protected masterPermissionService: MasterPermissionService
  ) {
    super(_snackbar, masterPermissionService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.items = [];
  }

  ngOnInit(): void {
    this.getComboBoxList();
  }

  public getComboBoxList(): void {
    let data: IMenuItem[];
    this.menuParameterService
      .getListMenuItem({
        size: 9999,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        data = res.body;

        this.listMenuItem = data.filter(o => o.parentId !== null);
      });
    this.positionTypeService
      .query({
        size: 9999,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        this.listPositionType = res.body;
      });
  }

  public onSelectMenu(element: string) {
    this.menuItemId = element;
    this.items = [];
    this.page = 0;
    this.paginator.firstPage();

    this.getBucketList();
  }
  public onSelectPosition(element: string) {
    this.positionTypeId = element;
    this.items = [];
    this.page = 0;
    this.paginator.firstPage();

    this.getBucketList();
  }
  public checkForPredicate(): any {
    const menuItemId = {
      page: this.page,
      size: this.itemsPerPage,
      menuItemId: this.menuItemId,
      sort: ['id', 'asc'],
    };

    const positionTypeId = {
      page: this.page,
      size: this.itemsPerPage,
      positionTypeId: this.positionTypeId,
      sort: ['id', 'asc'],
    };

    const bothParameter = {
      page: this.page,
      size: this.itemsPerPage,
      menuItemId: this.menuItemId,
      positionTypeId: this.positionTypeId,
      sort: ['id', 'asc'],
    };

    switch ('') {
      case this.menuItemId:
        return positionTypeId;
      case this.positionTypeId:
        return menuItemId;
      default:
        return bothParameter;
    }
  }

  public getBucketList(): void {
    this.loading = true;
    this.masterPermissionService.queryFilterBy(this.checkForPredicate()).subscribe(res => this.initDataForMatTable(res, res.headers));
  }

  protected postLoadDataLazy(): void {
    this.getBucketList();
  }

  previousState(): void {
    window.history.back();
  }

  public openDeleteDialog(element: IAppMenuPermission): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: 'Delete Certificate',
        message: 'Are you sure to delete this data?',
      },
      panelClass: 'custom-dialog-container-delete',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.masterPermissionService.delete(element.id).subscribe(() => {
          this.getBucketList();
        });
      }
    });
  }
}
