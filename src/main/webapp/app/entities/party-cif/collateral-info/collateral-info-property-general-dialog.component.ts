import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-party-cif-collateral-info-property-general-dialog',
  templateUrl: './collateral-info-property-general-dialog.component.html',
})
export class PartyCifCollateralInfoPropertyGeneralDialogComponent implements OnInit {
  public collateral: ICollateral;
  public collateralProperty: ICollateralProperty;
  public collateralPropertyExternal: ICollateralProperty;
  public partyCifData: IPartyCif;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
      partyCif: IPartyCif;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoPropertyGeneralDialogComponent>,
    protected collateralPropertyService: CollateralPropertyService
  ) {
    this.collateral = this.data.collateral;
    this.partyCifData = this.data.partyCif;
    this.collateralProperty = null;
    this.collateralPropertyExternal = null;
  }

  ngOnInit(): void {
    this.loadByCollateral(this.collateral.id);
    console.log('party cif', this.partyCifData.rm.name);
  }

  private loadByCollateral(collateralId: number): void {
    this.collateralPropertyService
      .queryFilterBy({
        page: 0,
        idCollateral: collateralId,
        idPropertyType: CollateralPropertyType.GENERAL,
        size: 9999,
      })
      .subscribe(res => {
        if (res.body.length > 0) {
          this.collateralProperty = lodash.find(res.body, function (o) {
            return !o.external;
          });
          this.collateralPropertyExternal = lodash.find(res.body, function (o) {
            return o.external;
          });
        }
      });
  }

  public save(): void {
    this._dialog.close([this.collateralProperty, this.collateralPropertyExternal]);
  }

  public print() {
    console.log(this.collateralProperty.attributes);
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }
}
