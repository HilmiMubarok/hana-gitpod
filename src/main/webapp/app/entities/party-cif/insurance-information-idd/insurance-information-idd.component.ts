import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ICollateral } from 'app/entities/collateral/collateral.model';

import { IPartyCif } from '../party-cif.model';
import { ICollateralProperty } from 'app/entities/collateral-property/collateral-property.model';
import { IInsurance } from './insurance-information.model';

@Component({
  selector: 'jhi-insurance-information-idd',
  templateUrl: './insurance-information-idd.component.html',
  styleUrls: ['./insurance-information-idd.style.scss'],
})
export class InsuranceInformationIddComponent implements OnInit {
  public excludeCif: any;
  private _collateral: ICollateral;
  public collateralProperty: ICollateralProperty;
  public collateralPropertyExternal: ICollateralProperty;
  public insuranceList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: MatTableDataSource<any>;
  public _partyCif: IPartyCif;
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }

  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }

  public displayedColumns: string[] = [
    'no',
    'insuranceNo',
    'insuranceType',
    'insuranceCompany',
    'brokerCompany',
    'insuranceAmount',
    'insuredDate',
    'expiryDate',
  ];
  public data = [];
  constructor(private partyCifService: PartyCifService) {}
  ngOnInit(): void {
    this.listInsuranceInformation(this.collateral.id);
  }

  public listInsuranceInformation(idCollateral: any): void {
    this.partyCifService.getListInsuranceInformation(idCollateral).subscribe(res => {
      let data = [];
      data = res.body;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }
}
