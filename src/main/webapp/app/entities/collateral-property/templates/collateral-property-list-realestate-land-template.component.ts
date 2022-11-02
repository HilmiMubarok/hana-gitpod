import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICollateral, ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { map } from 'rxjs';
import { ICollateralProperty } from '../collateral-property.model';
import { CollateralPropertyService } from '../collateral-property.service';

@Component({
  selector: 'jhi-collateral-property-list-realestate-land-template',
  templateUrl: './collateral-property-list-realestate-land-template.component.html',
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
export class CollateralPropertyListRealestateLandTemplateComponent
  extends AbstractEntityMaterialComponent<ICollateralProperty>
  implements OnChanges
{
  private _collateral: ICollateral;
  private _dataLand: ICollateralProperty[];
  public data: ICollateralProperty[];

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  @Input()
  get dataLand() {
    return this._dataLand;
  }
  set dataLand(param: ICollateralProperty[]) {
    this._dataLand = param;
  }

  public displayedColumnsLand: string[] = ['no', 'objectName', 'area', 'action'];
  public displayedColumnsExpand = [...this.displayedColumnsLand, 'expand'];
  public certificates: ICollateralLandAttribute[];
  constructor(private dialog: MatDialog, protected _snackbar: MatSnackBar, protected collateralPropertyService: CollateralPropertyService) {
    super(_snackbar, collateralPropertyService);
    this.page = 0;
    this.itemsPerPage = 10;
    this.predicate = 'id';
    this.entityKeyName = 'id';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateral']) {
      this.loadAll(this.collateral.id);
    }
  }
  private loadAll(_collateralId: number): void {
    this.collateralPropertyService
      .queryFilterBy({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sortData(),
        idCollateral: _collateralId,
        idPropertyType: CollateralPropertyType.LAND,
      })
      .pipe(map(res => this.preLoad(res)))
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }
  public loadDataLazy(event?: PageEvent): void {
    this.loadAll(this.collateral.id);
  }
  public getTotalArea(): number {
    if (this.dataLand) {
      return this.dataLand['filteredData'].map(t => t.landSizePerCertificate).reduce((prev: any, curr: any) => prev + curr, 0);
    }
    return 0;
  }

  public openDialogCertificate(element: ICollateralProperty): void {}

  public parsingSelectionCertificates(data: any): ICollateralLandAttribute[] {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  }

  public openDialog(element: ICollateralProperty = null): void {}
}
