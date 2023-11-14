import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { PARAMETER_TYPE } from 'app/shared/constants/base.constants';
import { GeneralParameter, IGeneralParameter } from '../general-parameter/general-parameter.model';
import { GeneralParameterService } from '../general-parameter/general-parameter.service';
import lodash from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { MasterCreditAgreementClausalDialogComponent } from './master-credit-agreement-clausal-dialog.component';

@Component({
  selector: 'jhi-credit-agreement-clausal',
  templateUrl: './master-credit-agreement-clausal.component.html',
  styleUrls: ['./master-credit-agreement-clausal.css'],
})
export class MasterCreditAgreementClausalComponent extends AbstractEntityMaterialComponent<IGeneralParameter> implements OnInit {
  public displayColumns: string[] = ['no', 'code', 'value', 'status', 'action'];
  constructor(protected _snackbar: MatSnackBar, protected generalParameterService: GeneralParameterService, protected dialog: MatDialog) {
    super(_snackbar, generalParameterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: PARAMETER_TYPE.CREDIT_AGREEMENT_CLAUSAL,
        page: 0,
        size: 9999,
        sort: this.sortData(),
      })
      .subscribe(res => {
        let data = res.body || [];
        data = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        this.items = new MatTableDataSource(data);

        this.items.paginator = this.paginator;
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: IGeneralParameter = null): void {
    let predicate: IGeneralParameter;
    predicate = new GeneralParameter();
    predicate.parameterTypeId = PARAMETER_TYPE.CREDIT_AGREEMENT_CLAUSAL;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterCreditAgreementClausalDialogComponent, {
      width: '100%',
      data: {
        generalParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IGeneralParameter) => {
      if (res) {
        if (res.id) {
          this.generalParameterService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.generalParameterService.create(res).subscribe(_res => {
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
