import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralPropertyMarketValueDialogComponent } from 'app/entities/collateral-property/collateral-property-market-value-dialog.component';
import { Collateral, CollateralAttribute, ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { map } from 'rxjs';
import { PartyCifCollateralInfoDialogComponent } from './collateral-info-dialog.component';
import lodash from 'lodash';
import { IPartyCif } from '../party-cif.model';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { PartyCifCollateralInfoPropertyGeneralDialogComponent } from './collateral-info-property-general-dialog.component';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { COLLATERAL_TYPE } from 'app/shared/constants/base.constants';
import { CollateralPropertyResultListComponent } from 'app/entities/collateral-property/collateral-property-result-list.component';
import { PartyCifService } from '../party-cif.service';

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
  public document: boolean;
  public _partyCif: IPartyCif;
  public collateral: ICollateral | null;
  private _collateralAppraisal: ICollateralAppraisal;

  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(items: IPartyCif) {
    this._partyCif = items;
  }

  @Input()
  get collateralAppraisal() {
    return this._collateralAppraisal;
  }

  set collateralAppraisal(items: ICollateralAppraisal) {
    this._collateralAppraisal = items;
  }

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
  constructor(
    protected collateralService: CollateralService,
    protected _snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected collateralPropertyService: CollateralPropertyService,
    protected partyCifService: PartyCifService
  ) {
    super(_snackbar, collateralService);

    this.selectedCollateral = null;
    this.itemsPerPage = 10;
    this.page = 0;
    this.entityKeyName = 'id';
    this.predicate = 'id';
    this.document = false;
    this.collateral = null;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['partyId']) {
      this.loadByPartyId(this.partyId);
    }
  }

  public openDocument(element: any) {
    this.collateral = element;
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

  public openDialogPropertyGeneral(element: ICollateral): void {
    const dialogRef = this.dialog.open(PartyCifCollateralInfoPropertyGeneralDialogComponent, {
      width: '80vw',
      data: { collateral: element },
    });
    dialogRef.afterClosed().subscribe((res: ICollateralProperty[]) => {
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const collateralProperty: ICollateralProperty = res[i];
          this.collateralPropertyService.update(collateralProperty).subscribe();
        }
        this.loadByPartyId(this.partyId);
      }
    });
  }

  public openDialogMarketValue(element: ICollateral): void {
    const dialogRef = this.dialog.open(CollateralPropertyMarketValueDialogComponent, {
      width: '100%',
      maxWidth: '95%',
      data: { collateral: element },
    });
    dialogRef.afterClosed().subscribe(res => {});
  }

  public showDetail(element: ICollateral = null): boolean {
    if (element) {
      if ([COLLATERAL_TYPE['realestate'], COLLATERAL_TYPE['vehicle'], COLLATERAL_TYPE['machine']].indexOf(element.collateralTypeId) > -1) {
        return true;
      }
    }

    return false;
  }

  public openDialog(element: ICollateral = null): void {
    let _collateral: ICollateral;
    _collateral = new Collateral();
    _collateral.attributes = new CollateralAttribute();
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
          this.collateralService.save(this.collateralService.preSaveConvert(res)).subscribe(res2 => {
            this.loadByPartyId(this.partyId);
          });
        } else {
          this.collateralService.create(this.collateralService.preSaveConvert(res)).subscribe(res2 => {
            this.loadByPartyId(this.partyId);
          });
        }
      }
    });
  }

  public openResult(element: ICollateral) {
    const dialogRef = this.dialog.open(CollateralPropertyResultListComponent, {
      width: '80vw',
      data: { collateral: element },
    });
  }

  cifNumber: string;
  // sync hobis
  syncHobis() {
    this.cifNumber = this.partyCif?.customerNumber;
    this.partyCifService.syncCollateralHobis(this.cifNumber).subscribe(res => {
      this.dataSource = res.body.collaterals;
    });
  }
}
