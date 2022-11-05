import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { leftRight } from '@syncfusion/ej2-angular-grids';
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
export class CollateralPropertyListRealestateCertificateTemplateComponent implements OnInit, OnChanges {
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
  public certificates: ICollateralLandAttribute[];
  constructor(private dialog: MatDialog) {
    this.certificates = [];
  }
  ngOnInit(): void {
    this.cekData();

    // if(this.collateral.attributes['landCertificates'] !== Array){
    //   this.certificates = JSON.parse(this.collateral.attributes['landCertificates']);
    //   this.certificates.push(this.certificates = this.collateral.attributes['landCertificates']);
    // }
    // console.log("ini certificates",this.collateral.attributes['landCertificates']);
    // console.log("ini", this.certificates);
  }

  public cekData() {
    console.log('constructor jalan');
    let data: ICollateralLandAttribute[] = [];
    if (typeof this.collateral.attributes['landCertificates'] === 'string') {
      console.log('data string');
      data = JSON.parse(this.collateral.attributes['landCertificates']);
      console.log(data);
      this.certificates = data;
    } else {
      console.log('bukan string', this.collateral.attributes['landCertificates']);
      console.log(typeof this.collateral.attributes['landCertificates']);
    }
    // if(this.collateral.attributes['landCertificates'] === '[]'){
    //   console.log("bukan array", this.collateral.attributes['landCertificates']);
    //   console.log("typ of", typeof this.collateral.attributes['landCertificates']);

    //   this.collateral.attributes['landCertificates'] = [];
    //   this.certificates = data;
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('hello');

    // if (changes['collateral']) {
    //   const attr: object =
    //     typeof this.collateral.attributes === 'string' ? JSON.parse(this.collateral.attributes) : this.collateral.attributes;
    //   this.certificates = attr['landCertificates'];

    //   console.log('ini collateral', this.collateral);

    //   this.totalCountAreaLand = 0;
    //   this.getTotalArea();
    // }
  }

  public countTotalLandArea(val1: number | 0, val2: number | 0): number {
    return val2 - val1;
  }

  public getTotalArea(): void {
    this.totalCountAreaLand = 0;
    if (this.certificates && this.certificates.length > 0) {
      for (let i = 0; i < this.certificates.length; i++) {
        this.totalCountAreaLand = this.totalCountAreaLand + this.certificates[i].certArea;
      }
    }
  }

  public openDialog(element: ICollateralLandAttribute = null): void {
    console.log(this.certificates);
    console.log('ini collateral', this.collateral);

    let predicate: ICollateralLandAttribute;
    predicate = new CollateralLandAttribute();

    if (element) {
      predicate = element;
    }

    if (!this.collateral.attributes) {
      this.collateral.attributes = new CollateralAttribute();
    } else {
      if (!lodash.has(this.collateral.attributes, 'landCertificates')) {
        this.collateral.attributes['landCertificates'] = new Array<ICollateralLandAttribute>();
      } else {
        if (typeof this.collateral.attributes['landCertificates'] === 'string') {
          this.collateral.attributes['landCertificates'] = JSON.parse(this.collateral.attributes['landCertificates']);
        }
      }
    }

    const dialogRef = this.dialog.open(CollateralPropertyCertificatesDialogComponent, {
      width: '80vw',
      data: {
        collateralLandAttribute: predicate,
        collateral: this.collateral,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collateral = lodash.cloneDeep(result);
        this.certificates = lodash.cloneDeep(result.attributes['landCertificates']);
        this.getTotalArea();
      }
    });
  }

  public delete(element: ICollateralLandAttribute): void {
    const copyCertificates: ICollateralLandAttribute[] = lodash.clone(this.certificates);
    const idx: number = lodash.findIndex(copyCertificates, function (o: ICollateralLandAttribute) {
      return o.id === element.id;
    });

    if (idx > -1) {
      copyCertificates.splice(idx, 1);
    }
    this.certificates = lodash.cloneDeep(copyCertificates);
    this.collateral.attributes['landCertificates'] = lodash.cloneDeep(copyCertificates);
    this.getTotalArea();
  }
}
