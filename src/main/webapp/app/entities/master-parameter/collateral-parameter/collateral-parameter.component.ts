import { Component, OnInit } from '@angular/core';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { CollateralParameter, ICollateralParameter } from './collateral-parameter.model';
import { CollateralParameterService } from './collateral-parameter.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { CollateralParameterDialogComponent } from './collateral-parameter-dialog.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-collateral-parameter',
  templateUrl: './collateral-parameter.component.html',
  styleUrls: ['./master-collateral.css'],
})
export class CollateralParameterComponent extends AbstractEntityMaterialComponent<ICollateralParameter> implements OnInit {
  public displayColumns: string[] = ['no', 'collateralDescription', 'collateralDetail', 'status', 'action'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];

  public listCollateralType = [];
  public typeID: string;
  constructor(
    protected _snackbar: MatSnackBar,
    protected collateralParameterService: CollateralParameterService,
    protected collateralTypeService: CollateralTypeService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, collateralParameterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnInit(): void {
    this.loadAll();
    this.getListType();
  }

  public getListType() {
    this.collateralTypeService.query().subscribe(res => {
      this.listCollateralType = res.body.filter(obj => obj.id !== 'CASH');
    });
  }

  public onSelect(element: any) {
    // const paramType = element;
    // this.collateralParameterService.setPrameterType(paramType);
    this.items = [];
    this.page = 0;
    this.typeID = element;
    this.loadAll();
    this.paginator.firstPage();
  }

  private loadAll(): void {
    // const data = this.collateralParameterService.paramTypeId.subscribe((message: any) => {
    // this.typeID = message;
    this.collateralParameterService
      .queryFilterBy({
        collateralType: this.typeID,
        page: this.page,
        size: this.itemsPerPage,
        sort: ['id', 'desc'],
      })
      .subscribe({
        next: (res: HttpResponse<ICollateralParameter[]>) => {
          this.initDataForMatTable(res, res.headers);
        },
        error: (res: HttpErrorResponse) => this.onError(res.message),
      });
    // });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: ICollateralParameter = null): void {
    let predicate: ICollateralParameter;
    predicate = new CollateralParameter();
    const data = this.collateralParameterService.paramTypeId.subscribe((message: any) => {
      this.typeID = message;
    });
    predicate.collateralType = this.typeID;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(CollateralParameterDialogComponent, {
      width: '100%',
      data: {
        collateralParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: ICollateralParameter) => {
      if (res) {
        if (res.id) {
          this.collateralParameterService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.collateralParameterService.create(res).subscribe(_res => {
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
