import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model';
import { DebtorDataService } from 'app/entities/debtor-data/debtor-data.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { PartyCifBusinessGroupDialogComponent } from './party-cif-business-group-dialog.component';

@Component({
  selector: 'jhi-party-cif-business-group',
  templateUrl: './party-cif-business-group.component.html',
})
export class PartyCifBusinessGroupComponent extends AbstractEntityMaterialComponent<IDebtorData> implements OnChanges {
  public dataSource: IDebtorData[];
  private _debtorData: IDebtorData;
  @Input()
  get debtorData() {
    return this._debtorData;
  }
  set debtorData(param: IDebtorData) {
    this._debtorData = param;
  }
  public displayedColumns: string[] = ['no', 'name', 'cif', 'action'];
  constructor(private dialog: MatDialog, protected _snackBar: MatSnackBar, protected debtorDataService: DebtorDataService) {
    super(_snackBar, debtorDataService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['debtorData']) {
      this.loadByGroupCompanyId(this.debtorData.groupCompanyId);
    }
  }

  private loadByGroupCompanyId(id: number): void {
    this.debtorDataService
      .queryFilterBy({
        idGroupCompany: id,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe(res => {
        this.dataSource = res.body;
      });
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(PartyCifBusinessGroupDialogComponent, {
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe((res: IDebtorData) => {
      if (res) {
        res.groupCompanyId = this.debtorData.groupCompanyId;
        this.debtorDataService.update(res).subscribe(_res => {
          this.loadByGroupCompanyId(this.debtorData.groupCompanyId);
        });
      }
    });
  }

  public delete(param: IDebtorData): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '80vw',
      data: {
        title: 'Delete Business Group',
        message: 'Are you sure to remove ' + param.customerName + ' with cif number ' + param.customerCIF + ' as your business group?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        param.groupCompanyId = null;
        this.debtorDataService.update(param).subscribe(_res => {
          this.loadByGroupCompanyId(this.debtorData.groupCompanyId);
        });
      }
    });
  }

  loadDataLazy(event?: PageEvent): void {
    this.loadByGroupCompanyId(this.debtorData.groupCompanyId);
  }
}
