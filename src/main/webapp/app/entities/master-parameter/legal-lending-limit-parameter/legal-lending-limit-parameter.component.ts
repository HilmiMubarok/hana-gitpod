import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { PARAMETER_TYPE } from 'app/shared/constants/base.constants';
import { GeneralParameter, IGeneralParameter } from '../general-parameter/general-parameter.model';
import { GeneralParameterService } from '../general-parameter/general-parameter.service';
import { MasterParameterLegalLendingLimitDialogComponent } from './legal-lending-limit-parameter-dialog.component';

@Component({
  selector: 'jhi-legal-lending-limit-parameter',
  templateUrl: './legal-lending-limit-parameter.component.html',
})
export class MasterParameterLegalLendingLimitComponent extends AbstractEntityMaterialComponent<IGeneralParameter> implements OnInit {
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
        idParameterType: PARAMETER_TYPE.LEGALLENDINGLIMIT,
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: IGeneralParameter = null): void {
    let predicate: IGeneralParameter;
    predicate = new GeneralParameter();
    predicate.parameterTypeId = PARAMETER_TYPE.LEGALLENDINGLIMIT;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterParameterLegalLendingLimitDialogComponent, {
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
}
