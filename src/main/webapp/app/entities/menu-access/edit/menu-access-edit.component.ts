import { Component, OnInit } from '@angular/core';
import { MenuAccessService } from '../menu-access.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MenuAccessAddComponent } from '../add/menu-access-add.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMenuAccess, IPositionAccess, MenuAccess, PositionAccess } from '../menu-access.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-menu-access-edit',
  templateUrl: './menu-access-edit.component.html',
  styleUrls: ['../menu-access.style.css'],
})
export class MenuAccessEditComponent implements OnInit {
  public id;
  public dataPosition = [];
  public data: any;
  public menuAccess: IMenuAccess;

  constructor(
    protected _snackbar: MatSnackBar,
    private menuAccessService: MenuAccessService,
    private activatedRoute: ActivatedRoute,
    protected dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe(res => (this.id = res['id']));
  }

  ngOnInit(): void {
    this.loadAll();
    this.menuAccessService
      .getMenuAccess({ idAppMenu: this.id })
      .pipe(map(data => data.body.filter(filtered => filtered.id === this.id)))
      .subscribe(res => (this.data = res[0]));
  }

  private loadAll(): void {
    this.menuAccessService
      .getMenuAccess({
        idAppMenu: this.id,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        this.paramType = res.body;
        const dataPosisi = res.body.map(obj => obj.positions);
        let dataPos = [];
        for (let i = 0; i < dataPosisi.length; i++) {
          dataPos = dataPosisi[i];
        }
        this.dataPosition = dataPos;
      });
  }

  displayedColumns: string[] = ['no', 'position', 'description', 'segregation', 'action'];
  dataSource$: Observable<Array<any>>;

  public typeID: string;
  public paramType: any;

  public openDialog(element: IMenuAccess = null): void {
    let predicate: IMenuAccess;
    predicate = new MenuAccess();
    predicate = this.paramType;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MenuAccessAddComponent, {
      width: '100%',
      data: {
        positionAccessparam: predicate,
      },
    });

    dialogRef.afterClosed().subscribe(res => {
      this.menuAccessService.create(res).subscribe(response => {
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
        this.menuAccessService.delete(element).subscribe(() => {
          this.loadAll();
        });
      }
    });
  }
  public previousState(): void {
    window.history.back();
  }
}
