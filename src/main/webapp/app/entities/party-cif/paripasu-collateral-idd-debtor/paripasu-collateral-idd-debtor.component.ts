import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CrossCollateralService } from 'app/entities/cross-collateral/cross-collateral.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ICollateral } from 'app/entities/collateral/collateral.model';

import { IPartyCif } from '../party-cif.model';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-paripasu-collateral-idd-debtor',
  templateUrl: './paripasu-collateral-idd-debtor.component.html',
  styleUrls: ['./paripasu-collateral-idd-debtor.style.scss'],
})
export class ParipasuCollateralIddDebtorComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public _partyCif: IPartyCif;
  public empty = [];
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(object: IPartyCif) {
    this._partyCif = object;
  }
  private _collateral: ICollateral;
  @Input()
  get collateral() {
    return this._collateral;
  }
  set collateral(param: ICollateral) {
    this._collateral = param;
  }
  public displayedColumns: string[] = ['no', 'cif', 'debtorNames', 'facilityType', 'ccy', 'totalPlafond', 'os'];
  public items: MatTableDataSource<any>;
  constructor(protected crossCollateralService: CrossCollateralService) {}

  ngOnInit(): void {
    this.crossCollateralGrid(this.collateral.id, this.partyCif.customerNumber);
  }

  public crossCollateralGrid(idCollateral: number, cifNumber: string): void {
    this.crossCollateralService
      .filterTableData({
        page: 0,
        size: 9999,
        collateralId: idCollateral,
        excludeCif: cifNumber,
      })
      .subscribe(res => {
        const data = res.body || [];
        this.items = new MatTableDataSource(data);
        this.items.paginator = this.paginator;
      });
  }
}
