import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralPropertyMarketValueDialogComponent } from 'app/entities/collateral-property/collateral-property-market-value-dialog.component';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { PartyCifCollateralInfoDialogComponent } from './collateral-info-dialog.component';

@Component({
  selector: 'jhi-party-cif-collateral-info',
  templateUrl: './collateral-info.component.html',
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
export class PartyCifCollateralInfoComponent extends AbstractEntityMaterialComponent<ICollateral> implements OnChanges {
  @Input() public partyId: string;
  public selectedCollateral: ICollateral;

  get dataSource() {
    return this.items;
  }
  set dataSource(param: any) {
    this.items = param;
  }

  public displayedColumns: string[] = [
    'no',
    'collateralInfo',
    'collateralType',
    'address',
    'kelurahan',
    'kecamatan',
    'kota',
    'status',
    'actions',
  ];
  public displayedColumnsExpand = [...this.displayedColumns, 'expand'];
  constructor(private collateralService: CollateralService, private _snackbar: MatSnackBar, private dialog: MatDialog) {
    super(_snackbar, collateralService);

    this.selectedCollateral = null;
    this.itemsPerPage = 10;
    this.page = 0;
    this.entityKeyName = 'id';
    this.predicate = 'id';
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyId']) {
      this.loadByPartyId(this.partyId);
    }
  }

  public expandData(element: ICollateral): void {
    this.selectedCollateral = element;
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        page: this.page,
        idParty: param,
        size: this.itemsPerPage,
        sort: this.sortData(),
      })
      .pipe(map(res => this.preLoad(res)))
      .subscribe({
        next: res => this.initDataForMatTable(res, res.headers),
        error: res => this.onError(res.message),
      });
  }

  preLoad(res: HttpResponse<ICollateral[]>): HttpResponse<ICollateral[]> {
    if (res.body) {
      for (let i = 0; i < res.body.length; i++) {
        const item: ICollateral = res.body[i];
        if (!item.attributes) {
          item.attributes = new CollateralAttribute();
        }
      }
    }
    return res;
  }

  public openDialogMarketValue(element: ICollateral): void {
    const dialogRef = this.dialog.open(CollateralPropertyMarketValueDialogComponent, {
      width: '100%',
      maxWidth: '95%',
      data: { collateral: element },
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  public goToProperty(element: ICollateral): void {}

  public openDialog(element: ICollateral = null): void {
    let _collateral: ICollateral;
    _collateral = new Collateral();
    _collateral.partyId = this.partyId;
    if (element) {
      _collateral = element;
    }
    const dialogRef = this.dialog.open(PartyCifCollateralInfoDialogComponent, {
      width: '80vw',
      data: { collateral: _collateral },
    });
    dialogRef.afterClosed().subscribe((res: ICollateral) => {
      if (res) {
        if (res.id) {
          this.collateralService.save(res).subscribe(res2 => {
            this.loadByPartyId(this.partyId);
          });
        } else {
          this.collateralService.create(res).subscribe(res2 => {
            this.loadByPartyId(this.partyId);
          });
        }
      }
    });
  }
}
