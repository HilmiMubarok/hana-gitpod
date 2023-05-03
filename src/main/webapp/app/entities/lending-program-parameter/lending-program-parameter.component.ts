import { Component, ViewChild, OnInit } from '@angular/core';
import { ILendingProgramParameter, LendingProgramParameter } from './lending-program-parameter.model';
import { LendingProgramParameterService } from './lending-program-parameter.service';
import { LendingProgramParameterDialogComponent } from './lending-program-parameter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-lending-program-parameter',
  templateUrl: './lending-program-parameter.component.html',
})
export class LendingProgramParameterComponent extends AbstractEntityMaterialComponent<ILendingProgramParameter> implements OnInit {
  public dateNow = new Date();
  displayedColumns: string[] = ['no', 'lending-program', 'start-date', 'end-date', 'status', 'action'];
  constructor(
    protected lendingProgramParameterService: LendingProgramParameterService,
    protected dialog: MatDialog,
    protected _snackbar: MatSnackBar
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
    this.lendingProgramParameterService
      .query({
        page: this.page,
        size: this.itemsPerPage,
      })
      .subscribe({
        next: res => {
          res.body.forEach((el: any) => {
            if (new Date(el.thruDate) < this.dateNow && el.statusId === 'ACTIVE') {
              el.statusId = 'NON_ACTIVE';
              el.statusDescription = 'Non Active';
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
