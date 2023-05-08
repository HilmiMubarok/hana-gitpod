import { Component, ViewChild, OnInit } from '@angular/core';
import { ILendingProgramParameter, LendingProgramParameter } from './lending-program-parameter.model';
import { LendingProgramParameterService } from './lending-program-parameter.service';
import { LendingProgramParameterDialogComponent } from './lending-program-parameter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-lending-program-parameter',
  templateUrl: './lending-program-parameter.component.html',
})
export class LendingProgramParameterComponent extends AbstractEntityMaterialComponent<ILendingProgramParameter> implements OnInit {
  displayedColumns: string[] = ['no', 'lending-program', 'start-date', 'end-date', 'status', 'action'];
  constructor(
    protected lendingProgramParameterService: LendingProgramParameterService,
    protected dialog: MatDialog,
    protected _snackbar: MatSnackBar,
    protected _datePipe: DatePipe
  ) {
    super(_snackbar, lendingProgramParameterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
  }

  ngOnInit(): void {
    this.loadAll();
  }

  get lendingProgramParameters() {
    return this.items;
  }

  set lendingProgramParameters(lendingProgramParameter: ILendingProgramParameter[]) {
    this.items = lendingProgramParameter;
  }

  private loadAll(): void {
    const currentDate = new Date();
    // const tomorrow = new Date(currentDate.getTime());
    // const yesterday = new Date(currentDate.getTime());
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // yesterday.setDate(yesterday.getDate() - 1);
    this.lendingProgramParameterService
      .query({
        page: this.page,
        size: this.itemsPerPage,
      })
      .subscribe({
        next: res => {
          res.body.forEach((el: any) => {
            console.log('ell', this._datePipe.transform(new Date(el.thruDate), 'dd-MM-yyyy'));
            if (
              this._datePipe.transform(new Date(el.thruDate), 'dd-MM-yyyy') <
                this._datePipe.transform(new Date(currentDate), 'dd-MM-yyyy') &&
              el.statusId === 'ACTIVE'
            ) {
              el.statusId = 'NON_ACTIVE';
              el.statusDescription = 'Non Active';
              this.lendingProgramParameterService.update(el).subscribe(res2 => {
                console.log('eeellll', res2);
              });
            }
            if (
              this._datePipe.transform(new Date(el.fromDate), 'dd-MM-yyyy') ===
                this._datePipe.transform(new Date(currentDate), 'dd-MM-yyyy') &&
              el.statusId === 'NON_ACTIVE'
            ) {
              el.statusId = 'ACTIVE';
              el.statusDescription = 'Active';
              this.lendingProgramParameterService.update(el).subscribe(res2 => {
                console.log('eeellll', res2);
              });
            }
          });
          this.initDataForMatTable(res, res.headers);
        },
        error: res => this.onError(res.message),
      });
  }

  public openDialog(element: ILendingProgramParameter = null): void {
    let predicate: ILendingProgramParameter;
    predicate = new LendingProgramParameter();

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(LendingProgramParameterDialogComponent, {
      width: '60%',
      data: {
        lendingProgramParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: ILendingProgramParameter) => {
      if (res) {
        if (res.id) {
          this.lendingProgramParameterService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.lendingProgramParameterService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }
}
