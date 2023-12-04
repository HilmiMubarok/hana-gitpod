import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatTableDataSource } from '@angular/material/table';
import { IMasterFinancialInstitution, MasterFinancialInstitution } from './master-financial-institution.model';
import { MasterFinancialInstitutionDialogComponent } from './master-financial-institution-dialog.component';
import { MasterFinancialInstitutionService } from './master-financial-institution.service';

@Component({
  selector: 'jhi-master-finansial-institution',
  templateUrl: './master-financial-institution.component.html',
  styleUrls: ['./master-financial-institution.css'],
})
export class MasterFinancialInstitutionComponent extends AbstractEntityMaterialComponent<IMasterFinancialInstitution> implements OnInit {
  public displayColumns: string[] = ['no', 'code', 'name', 'description', 'status', 'action'];
  constructor(
    protected _snackbar: MatSnackBar,
    protected masterFinancialInstitutionService: MasterFinancialInstitutionService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, masterFinancialInstitutionService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.masterFinancialInstitutionService
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

  public openDialog(element: IMasterFinancialInstitution = null): void {
    let predicate: IMasterFinancialInstitution;
    predicate = new MasterFinancialInstitution();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterFinancialInstitutionDialogComponent, {
      width: '100%',
      data: {
        masterFinancialInstitution: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IMasterFinancialInstitution) => {
      if (res) {
        if (res.id) {
          this.masterFinancialInstitutionService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.masterFinancialInstitutionService.create(res).subscribe(_res => {
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
