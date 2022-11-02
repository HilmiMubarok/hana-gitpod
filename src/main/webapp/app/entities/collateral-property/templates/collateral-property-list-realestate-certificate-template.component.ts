import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CollateralAttribute,
  CollateralLandAttribute,
  ICollateral,
  ICollateralLandAttribute,
} from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { CollateralPropertyCertificatesDialogComponent } from '../dialogs/collateral-property-certificates-dialog.component';

@Component({
  selector: 'jhi-collateral-property-list-realestate-certificate-template',
  templateUrl: './collateral-property-list-realestate-certificate-template.component.html',
})
export class CollateralPropertyListRealestateCertificateTemplateComponent implements OnInit {
  public displayedColumnsLand: string[] = [
    'no',
    'certificateNo',
    'certificateName',
    'issueDate',
    'dueDate',
    'suratUkurNum',
    'area',
    'action',
  ];
  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  public totalCountAreaLand: number;
  public certificates: ICollateralLandAttribute[] = [];
  public xxx = [];

  ngOnInit(): void {
    console.log('ini collateral', this.collateral);
  }

  public print() {
    this.collateral.attributes['landCertificates'] = JSON.parse(this.collateral.attributes['landCertificates']);
    this.certificates = this.collateral.attributes['landCertificates'];
    console.log('ini certificates', this.certificates);
  }
}
