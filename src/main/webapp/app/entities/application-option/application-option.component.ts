import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { ApplicationOptionViewDialogComponent } from './application-option-view-dialog.component';
import { IApplicationOption } from './application-option.model';
import { ApplicationOptionService } from './application-option.service';

@Component({
  selector: 'jhi-application-option',
  templateUrl: './application-option.component.html',
})
export class ApplicationOptionComponent extends AbstractEntityMaterialComponent<IApplicationOption> implements OnInit {
  public displayColumns: string[] = ['no', 'key', 'description', 'value', 'action'];
  get applicationOptions() {
    return this.items;
  }

  set applicationOptions(param: IApplicationOption[]) {
    this.items = param;
  }

  constructor(protected _snackBar: MatSnackBar, protected applicationOptionService: ApplicationOptionService, protected dialog: MatDialog) {
    super(_snackBar, applicationOptionService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.applicationOptionService
      .query({
        page: this.page,
        sort: this.sortData(),
        size: this.itemsPerPage,
      })
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  public loadDataLazy(event: any): void {
    this.loadAll();
  }

  public openDialog(element: IApplicationOption): void {
    const dialogRef = this.dialog.open(ApplicationOptionViewDialogComponent, {
      width: '100%',
      data: {
        applicationOption: element,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      this.applicationOptionService.update(res).subscribe(_res => {
        this.loadAll();
      });
    });
  }
}
