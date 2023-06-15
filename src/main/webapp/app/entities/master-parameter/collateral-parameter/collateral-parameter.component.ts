import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { CollateralParameter, ICollateralParameter } from './collateral-parameter.model';
import { CollateralParameterService } from './collateral-parameter.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralTypeService } from 'app/entities/collateral-type/collateral-type.service';
import { CollateralParameterDialogComponent } from './collateral-parameter-dialog.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  CollateralProposePricingParameter,
  ICollateralProposePricingParam,
} from './collateral-propose-pricing/propose-pricing-parameter.model';
import { CollateralProposePricingParameterService } from './collateral-propose-pricing/propose-pricing-parameter.service';
import { CollateralProposePricingDialogEditComponent } from './collateral-propose-pricing/collateral-propose-pricing-dialog-edit.component';
@Component({
  selector: 'jhi-collateral-parameter',
  templateUrl: './collateral-parameter.component.html',
  styleUrls: ['./master-collateral.css'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({
          height: '0px',
          minHeight: '0',
        })
      ),
      state(
        'expanded',
        style({
          height: '*',
        })
      ),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CollateralParameterComponent extends AbstractEntityMaterialComponent<ICollateralParameter> implements OnInit {
  public displayedColumns: string[] = ['no', 'collateralDescription', 'collateralDetail', 'status', 'action'];
  public displayColumns: string[] = ['no', 'proposePricingCode', 'proposePricing', 'collateralParameterDetailType', 'action'];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];

  public listCollateralType = [];
  public typeID: string;
  public collateralParameterId: number;
  public selectedCollateral: ICollateralParameter;
  private _dataSource: ICollateralProposePricingParam[];
  private _collateralParam: ICollateralParameter;

  @Input()
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(param: ICollateralProposePricingParam[]) {
    this._dataSource = param;
  }
  @Input()
  get collateralParam() {
    return this._collateralParam;
  }
  set collateralParam(param: ICollateralParameter) {
    this._collateralParam = param;
  }
  constructor(
    protected _snackbar: MatSnackBar,
    protected collateralParameterService: CollateralParameterService,
    protected collateralTypeService: CollateralTypeService,
    protected collateralProposePricingService: CollateralProposePricingParameterService,
    protected dialog: MatDialog
  ) {
    super(_snackbar, collateralParameterService);
    this.selectedCollateral = null;
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
    this.items = [];
    this.page = 0;
    this.typeID = element;
    this.loadAll();
    this.paginator.firstPage();
  }

  private loadAll(): void {
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
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  public openDialog(element: ICollateralParameter = null, view: string): void {
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
        mode: view,
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

  //  Grid Collateral Propose Pricingthis.
  public expandData(param: ICollateralParameter): void {
    this.selectedCollateral = param;
    this.collateralProposePricingService.filterTableData(param.id).subscribe(res => {
      this.dataSource = res.body;
      console.log('res body', this.dataSource);
    });
  }

  public openDialogPricing(element: ICollateralProposePricingParam = null, view: string): void {
    let predicate: ICollateralProposePricingParam;
    predicate = new CollateralProposePricingParameter();

    const data = this.collateralProposePricingService.paramTypeId.subscribe((message: any) => {
      this.collateralParameterId = message;
    });
    console.log('data', data);
    predicate.collateralParameterId = this.collateralParameterId;

    if (element) {
      predicate = element;
    }

    const dialogRef = this.dialog.open(CollateralProposePricingDialogEditComponent, {
      width: '100%',
      data: {
        collateralProposePricingParameter: predicate,
        dataCollateral: this.selectedCollateral,
        mode: view,
      },
    });
    dialogRef.afterClosed().subscribe((res: ICollateralProposePricingParam) => {
      if (res) {
        if (res.id) {
          this.collateralProposePricingService.update(res).subscribe(_res => {
            this.loadAll();
          });
        } else {
          this.collateralProposePricingService.create(res).subscribe(_res => {
            this.loadAll();
          });
        }
      }
    });
  }
}
