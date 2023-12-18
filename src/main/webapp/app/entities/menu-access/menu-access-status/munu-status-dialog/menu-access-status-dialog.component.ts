import { Component, Inject, OnInit } from '@angular/core';
import { IMenuItem, IStatusAccess, IStatusMenuAccess } from '../menu-access-status.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuAccessStatusService } from '../menu-access-status.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { MenuAccessAddComponent } from '../../add/menu-access-add.component';
import { MessageService } from 'primeng/api';
import { MenuAccessStatusAddService } from '../menu-access-status-add.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-menu-access-status-dialog',
  templateUrl: './menu-access-status-dialog.component.html',
})
export class MenuAccessStatusDialogComponent implements OnInit {
  public status = [];
  public typeposisi: string;
  id;
  public statusMenuAccess: IStatusMenuAccess;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      positionAccessparam: IStatusMenuAccess;
    },
    protected messageService: MessageService,

    private _dialog: MatDialogRef<MenuAccessAddComponent>,
    private menuAccessStatusAddService: MenuAccessStatusAddService,
    private menuAccessStatusService: MenuAccessStatusService,
    private activatedRoute: ActivatedRoute
  ) {
    this.statusMenuAccess = this.data.positionAccessparam;
    this.activatedRoute.params.subscribe(res => (this.id = res['id']));
  }

  ngOnInit(): void {
    this.getListMenuItem();
  }
  public statusId: string;
  public statusDescription: string;

  private getListMenuItem(): void {
    const a = ['CREDIT_PROPOSAL', 'SLIK', 'COLLATERALAPPRAISAL', 'COLLATERAL_APPRAISAL', 'INSURANCE_AGREEMENT'];
    this.menuAccessStatusAddService
      .getListMenuItem({
        idStatusType: a,
        size: 9999,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        this.status = res.body;

        if (this.status.length > 0) {
          let posId: string;
          let posDesc: string;
          for (let i = 0; i < this.status.length; i++) {
            posId = this.status[i].id;
            posDesc = this.status[i].description;
          }

          this.statusId = posId;
          this.statusDescription = posDesc;
        }
      });
  }

  public save(): void {
    // create
    if (this.statusMenuAccess) {
      const newPos = {
        menuItemDescription: this.statusMenuAccess[0].description,
        menuItemId: this.statusMenuAccess[0].id,
        parentMenuItemCode: this.statusMenuAccess[0].statusCode,
        statusDescription: this.statusDescription,
        statusId: this.statusId,
      };

      this._dialog.close(newPos);
    }
  }
  public onSelect(event: any): void {
    this.statusId = event;
  }
  displayedColumns: string[] = ['no', 'status'];
  dataSource$: Observable<Array<any>>;

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
