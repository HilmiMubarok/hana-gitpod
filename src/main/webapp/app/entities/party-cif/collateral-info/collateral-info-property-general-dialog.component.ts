import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollateralProperty, ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { CollateralPropertyService } from 'app/entities/collateral-property/collateral-property.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { CollateralPropertyType } from 'app/shared/model/enumerations/collateral-property-type.model';
import lodash from 'lodash';
import { IPartyCif } from '../party-cif.model';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-party-cif-collateral-info-property-general-dialog',
  templateUrl: './collateral-info-property-general-dialog.component.html',
  styleUrls: ['./collateral-info.style.scss'],
})
export class PartyCifCollateralInfoPropertyGeneralDialogComponent implements OnInit {
  public collateral: ICollateral;
  public collateralProperty: ICollateralProperty;
  public collateralPropertyExternal: ICollateralProperty;
  public partyCifData: IPartyCif;
  public branchId: string;
  private _pariPasu: string;
  collateralProperties: ICollateralProperty[];
  @Input()
  get pariPasu() {
    return this._pariPasu;
  }
  set pariPasu(data: string) {
    this._pariPasu = data;
  }
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
      partyCif: IPartyCif;
      rmBranchId: string;
      pariPasu: string;
    },
    private router: Router,
    private _dialog: MatDialogRef<PartyCifCollateralInfoPropertyGeneralDialogComponent>,
    protected collateralPropertyService: CollateralPropertyService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.collateral = this.data.collateral;
    this.pariPasu = this.data.pariPasu;
    this.partyCifData = this.data.partyCif;
    this.collateralProperty = null;
    this.collateralPropertyExternal = null;
    this.branchId = this.data.rmBranchId;
    this.collateralProperties = [];
  }

  ngOnInit(): void {
    this.loadByCollateral(this.collateral.id);
    console.log('collateral type ', this.collateral.collateralTypeId);
    console.log('pariPasu', this.pariPasu);
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
          this.collateralProperties = res.body;
          this.collateralProperty = lodash.find(res.body, function (o) {
            return !o.external;
          });
          this.collateralPropertyExternal = lodash.find(res.body, function (o) {
            return o.external;
          });
        } else {
          const collProp = new CollateralProperty();
          collProp.propertyType = CollateralPropertyType.GENERAL;
          collProp.partyId = this.partyCifData.partyId;
          collProp.external = false;
          collProp.collateralId = this.collateral.id;
          collProp.attributes = {};
          this.collateralProperty = collProp;

          const collPropEx = new CollateralProperty();
          collPropEx.propertyType = CollateralPropertyType.GENERAL;
          collPropEx.partyId = this.partyCifData.partyId;
          collPropEx.external = true;
          collPropEx.collateralId = this.collateral.id;
          collPropEx.attributes = {};
          this.collateralPropertyExternal = collPropEx;
        }
      });
  }

  private convertDate(date: any): any {
    const dateOfDate = new Date(date);
    const ustConvert = new Date(
      Date.UTC(dateOfDate.getFullYear(), dateOfDate.getMonth(), dateOfDate.getDate(), dateOfDate.getHours(), dateOfDate.getMinutes())
    );
    return ustConvert;
  }

  public save(): void {
    const copyCollateralProperty: ICollateralProperty = lodash.cloneDeep(this.collateralProperty);
    if (this.router.url.split('/')[1] === 'party-cif') {
      if (copyCollateralProperty.attributes.expiry) {
        if (typeof copyCollateralProperty.attributes.expiry === 'object') {
          copyCollateralProperty.attributes.expiry = this.convertDate(copyCollateralProperty.attributes.expiry);
        }
      }
    }
    if (this.router.url.split('/')[1] === 'party-cif') {
      if (copyCollateralProperty.attributes.maturityDate) {
        if (typeof copyCollateralProperty.attributes.maturityDate === 'object') {
          copyCollateralProperty.attributes.maturityDate = this.convertDate(copyCollateralProperty.attributes.maturityDate);
        }
      }
    }
    if (this.router.url.split('/')[1] === 'party-cif') {
      if (copyCollateralProperty.attributes.certificateExpiryDate) {
        if (typeof copyCollateralProperty.attributes.certificateExpiryDate === 'object') {
          copyCollateralProperty.attributes.certificateExpiryDate = this.convertDate(
            copyCollateralProperty.attributes.certificateExpiryDate
          );
        }
      }
    }
    this._dialog.close([copyCollateralProperty, this.collateralPropertyExternal]);
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

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
