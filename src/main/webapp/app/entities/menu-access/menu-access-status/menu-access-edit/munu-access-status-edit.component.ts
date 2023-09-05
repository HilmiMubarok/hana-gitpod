import { Component, OnInit } from '@angular/core';
import { IStatusMenuAccess, StatusMenuAccess } from '../menu-access-status.model';
import { Observable, map } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuAccessStatusService } from '../menu-access-status.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MenuAccessStatusDialogComponent } from '../munu-status-dialog/menu-access-status-dialog.component';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';

@Component({
  selector: 'jhi-menu-access-status-edit',
  templateUrl: './menu-access-status-edit.component.html',
  styleUrls: ['../../menu-access.style.css'],
})
export class MenuAccessStatusEditComponent implements OnInit {
  public id;
  public dataStatus = [];
  public data: any;
  public menuStatus: IStatusMenuAccess;
  public paramType: any;

  constructor(
    private menuAccessStatusService: MenuAccessStatusService,
    private activatedRoute: ActivatedRoute,
    protected dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe(res => (this.id = res['id']));
  }
  ngOnInit(): void {
    this.loadAll();
    this.menuAccessStatusService
      .getAccessStatus({ idappMenu: this.id })
      .pipe(map(data => data.body.filter(filtered => filtered.id === this.id)))
      .subscribe(res => (this.data = res[0]));
  }

  displayedColumns: string[] = ['no', 'status', 'action'];
  dataSource$: Observable<Array<any>>;

  private loadAll(): void {
    this.menuAccessStatusService.getAccessStatus({ idappMenu: this.id, sort: ['id', 'asc'] }).subscribe(res => {
      const param = lodash.filter(res.body, e => e.id === this.id);
      const dataPosisi = param.map(z => z.statuses);
      this.paramType = param;
      let dataPos = [];

      for (let i = 0; i < dataPosisi.length; i++) {
        dataPos = dataPosisi[i];
      }
      this.dataStatus = dataPos;
    });
  }

  public openDialog(element: IStatusMenuAccess): void {
    let predicate: IStatusMenuAccess;
    predicate = new StatusMenuAccess();
    this.paramType = predicate;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MenuAccessStatusDialogComponent, {
      width: '100%',
      data: {
        positionAccessparam: predicate,
      },
    });

    dialogRef.afterClosed().subscribe(res => {
      this.menuAccessStatusService.create(res).subscribe(response => {
        this.loadAll();
      });
    });
  }

  public openDelete(element): void {
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
        this.menuAccessStatusService.delete(element).subscribe(() => {
          this.loadAll();
        });
      }
    });
  }
}
