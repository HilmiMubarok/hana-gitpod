import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatTableDataSource } from '@angular/material/table';
import { MasterCompanyTypeDialogComponent } from './master-company-type-dialog.component';
import { IMasterCompanyType, MasterCompanyType } from './master-company-type.model';
import { MasterCompanyTypeService } from './master-company-type.service';

@Component({
  selector: 'jhi-credit-agreement-clausal',
  templateUrl: './master-company-type.component.html',
  styleUrls: ['./master-company-type.css'],
})
export class MasterCompanyTypeComponent extends AbstractEntityMaterialComponent<IMasterCompanyType> implements OnInit {
  public displayColumns: string[] = ['no', 'code', 'name', 'abbreviation', 'status', 'action'];
  constructor(protected _snackbar: MatSnackBar, protected masterCompanyTypeService: MasterCompanyTypeService, protected dialog: MatDialog) {
    super(_snackbar, masterCompanyTypeService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.masterCompanyTypeService
      .query({
        page: 0,
        size: 9999,
        sort: this.sortData(),
      })
      .subscribe(res => {
        const data = res.body || [];
        // data = lodash.filter(res.body, function (o) {
        //   return o.statusId === 'ACTIVE';
        // });
        this.items = new MatTableDataSource(data);

        this.items.paginator = this.paginator;
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: IMasterCompanyType = null): void {
    let predicate: IMasterCompanyType;
    predicate = new MasterCompanyType();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterCompanyTypeDialogComponent, {
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

  previousState(): void {
    window.history.back();
  }
}
