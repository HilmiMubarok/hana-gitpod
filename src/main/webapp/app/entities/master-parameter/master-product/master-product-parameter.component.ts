import { Component, OnInit } from '@angular/core';
import { IMasterProductParameter, MasterProductParameter } from './master-product-parameter.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterProductParameterService } from './master-product-parameter.service';
import { MatDialog } from '@angular/material/dialog';
import { MasterProductParameterDialogComponent } from './master-product-parameter-dialog.component';

@Component({
  selector: 'jhi-master-product-parameter',
  templateUrl: './master-product-parameter.component.html',
  styleUrls: ['./master-product.css'],
})
export class MasterProductParameterComponent extends AbstractEntityMaterialComponent<IMasterProductParameter> implements OnInit {
  public displayColumns: string[] = ['no', 'code', 'description', 'action'];
  public displayedColumnsExpand = [...this.displayColumns, 'expand'];

  public masterProduct: IMasterProductParameter;
  public productVal = [];

  public listGeneralLov;
  public typeID: string;
  constructor(
    protected _snackbar: MatSnackBar,
    protected productParameterService: MasterProductParameterService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, productParameterService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }

  ngOnInit(): void {
    this.loadAll();
    this.getFacilityType();
  }

  public getListType() {
    this.productParameterService
      .queryFilterBy({
        page: 0,
        size: 9999,
        idParentProduct: 'LOAN_PRODUCT',
        sort: ['desc'],
      })
      .subscribe(res => {
        this.listGeneralLov = res.body;
      });
  }

  public getFacilityType() {
    this.productParameterService.getLovFacilityType().subscribe(res => {
      this.listGeneralLov = res.body;
    });
  }

  public onSelect(element: any) {
    const paramType = element;
    this.productParameterService.setPrameterType(paramType);
  }

  private loadAll(): void {
    const data = this.productParameterService.paramTypeId.subscribe((message: any) => {
      this.typeID = message;
      this.productParameterService
        .queryFilterBy({
          idProductType: this.typeID,
          page: this.page,
          size: this.itemsPerPage,
          sort: ['id', 'desc'],
        })
        .subscribe({
          next: res => this.initDataForMatTable(res, res.headers),
          error: res => this.onError(res.message),
        });
    });
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: IMasterProductParameter = null): void {
    let predicate: IMasterProductParameter;
    predicate = new MasterProductParameter();
    const data = this.productParameterService.paramTypeId.subscribe((message: any) => {
      this.typeID = message;
    });
    predicate.productTypeId = this.typeID;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(MasterProductParameterDialogComponent, {
      width: '100%',
      data: {
        productParameter: predicate,
      },
    });
    dialogRef.afterClosed().subscribe((res: IMasterProductParameter) => {
      if (res) {
        if (res.id) {
          this.productParameterService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.productParameterService.create(res).subscribe(_res => {
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
