import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral, ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import { map } from 'rxjs';
import { CollateralLandCertificationDialogComponent } from './dialogs/collateral-land-certification-selection-dialog.component';
import { CollateralLandInfoDialogComponent } from './dialogs/collateral-land-info-dialog.component';
import lodash from 'lodash';
import { CollateralAppraisalService } from '../collateral-appraisal.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'jhi-collateral-appraisal-process-detail-land',
  templateUrl: './collateral-appraisal-process-detail-land.component.html',
  styleUrls: ['./collateral-appraisal-process-detail-real-estate.css'],
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
export class CollateralAppraisalDetailProcessLandComponent
  extends AbstractEntityMaterialComponent<ICollateralProperty>
  implements OnChanges
{
  public listOfValues = {
    property_usage: [
      'Rumah Tinggal',
      'Ruko/Rukan',
      'Apartment',
      'Office Space',
      'Kios',
      'Pabrik',
      'Gudang',
      'Tanah/Kavling',
      'Kendaraan',
      'Alat Berat',
      'Lainnya',
    ],
    land_shape: ['Beraturan', 'Tidak beraturan', 'Trapesium', 'Segitiga', 'Lainnya'],
    madeWith: ['Aspal', 'Beton', 'Paving', 'Tanah', 'Sirtu (Pasir Batu)', 'Lainnya'],
    direction: ['Utara', 'Selatan', 'Barat', 'Timur', 'Timur Laut', 'Barat Daya', 'Tenggara', 'Barat Laut'],
  };
  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  get collateralProperties() {
    return this.items;
  }
  set collateralProperties(param: ICollateralProperty[]) {
    this.items = param;
  }

  public displayedColumnsLand: string[] = ['no', 'objectName', 'area', 'action'];
  public displayedColumnsExpand = [...this.displayedColumnsLand, 'expand'];
  public certificates: ICollateralLandAttribute[];
  constructor(
    private dialog: MatDialog,
    protected _snackbar: MatSnackBar,
    protected collateralPropertyService: CollateralPropertyService,
    private collateralAppraisalService: CollateralAppraisalService
  ) {
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
    if (this.collateralProperties) {
      this.collateralAppraisalService.totalDataDetailLand = this.collateralProperties['filteredData'];
      return this.collateralProperties['filteredData'].map(t => t.landSizePerCertificate).reduce((prev: any, curr: any) => prev + curr, 0);
    }
    return 0;
  }

  public delete(element: ICollateralProperty): void {
    this.collateralPropertyService.delete(element.id).subscribe(res => {
      this.loadAll(this.collateral.id);
    });
  }

  public openDialogCertificate(element: ICollateralProperty): void {
    const dialogRef = this.dialog.open(CollateralLandCertificationDialogComponent, {
      width: '80vw',
      data: {
        landCertificates:
          typeof this.collateral.attributes['landCertificates'] === 'string'
            ? JSON.parse(this.collateral.attributes['landCertificates'])
            : this.collateral.attributes['landCertificates'],
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        const copyElement: ICollateralProperty = lodash.cloneDeep(element);
        copyElement.attributes['selectionCertificates'] = JSON.stringify(res);
        this.collateralPropertyService.update(copyElement).subscribe(_res => {
          this.loadAll(this.collateral.id);
        });
      }
    });
  }

  public parsingSelectionCertificates(data: any): ICollateralLandAttribute[] {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data;
  }

  public openDialog(element: ICollateralProperty = null): void {
    let colProp: ICollateralProperty;
    colProp = new CollateralProperty();
    colProp.collateralId = this.collateral.id;
    colProp.propertyType = CollateralPropertyType.LAND;

    if (element) {
      colProp = element;
    }

    const dialogRef = this.dialog.open(CollateralLandInfoDialogComponent, {
      width: '80vw',
      data: {
        collateralProperty: colProp,
      },
    });
    dialogRef.afterClosed().subscribe((result: ICollateralProperty) => {
      if (result) {
        if (result.id) {
          this.collateralPropertyService.update(result).subscribe(_res => {
            this.loadAll(this.collateral.id);
          });
        } else {
          this.collateralPropertyService.create(result).subscribe(_res => {
            this.loadAll(this.collateral.id);
          });
        }
      }
    });
  }

  public changeBuildingFacility(event: MatCheckboxChange, facilityType: string): void {
    const value: boolean = event.checked;
    if (facilityType === 'housingComplex') {
      this.collateral.attributes['buildingHousingComplex'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'looseSettlement') {
      this.collateral.attributes['buildingLooseSettlement'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'officeComplex') {
      this.collateral.attributes['buildingOfficeComplex'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'commercialArea') {
      this.collateral.attributes['buildingCommercialArea'] = value === true ? 'yes' : 'no';
    } else if (facilityType === 'warehousingArea') {
      this.collateral.attributes['buildingWareHousingArea'] = value === true ? 'yes' : 'no';
    }
  }
}
