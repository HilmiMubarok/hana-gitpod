import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatTableDataSource } from '@angular/material/table';
import { MasterCreditAgreementClausalDialogComponent } from './master-credit-agreement-clausal-dialog.component';
import { IMasterCreditAgreementClausal, MasterCreditAgreementClausal } from './master-credit-agreement-clausal.model';
import { MasterCreditAgreementClausalService } from './master-credit-agreement-clausal.service';

@Component({
  selector: 'jhi-credit-agreement-clausal',
  templateUrl: './master-credit-agreement-clausal.component.html',
  styleUrls: ['./master-credit-agreement-clausal.css'],
})
export class MasterCreditAgreementClausalComponent
  extends AbstractEntityMaterialComponent<IMasterCreditAgreementClausal>
  implements OnInit
{
  public displayColumns: string[] = ['no', 'code', 'parameterCategoryDescription', 'description', 'status', 'action'];
  constructor(
    protected _snackbar: MatSnackBar,
    protected masterCreditAgreementClausalService: MasterCreditAgreementClausalService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, masterCreditAgreementClausalService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.masterCreditAgreementClausalService
      .query({
        page: 0,
        size: 9999,
        sort: ['sequence', 'asc'],
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

  public openDialog(element: IMasterCreditAgreementClausal = null): void {
    let predicate: IMasterCreditAgreementClausal;
    predicate = new MasterCreditAgreementClausal();
    predicate.parameterCategoryId = '';
    predicate.statusId = '';

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterCreditAgreementClausalDialogComponent, {
      width: '100%',
      data: {
        masterCreditAgreementClausal: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IMasterCreditAgreementClausal) => {
      if (res) {
        if (res.id) {
          this.masterCreditAgreementClausalService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.masterCreditAgreementClausalService.create(res).subscribe(_res => {
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
