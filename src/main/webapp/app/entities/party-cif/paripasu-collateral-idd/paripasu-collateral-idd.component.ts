import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CrossCollateralService } from 'app/entities/cross-collateral/cross-collateral.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ICollateral } from 'app/entities/collateral/collateral.model';

import { IPartyCif } from '../party-cif.model';

@Component({
  selector: 'jhi-paripasu-collateral-idd',
  templateUrl: './paripasu-collateral-idd.component.html',
  styleUrls: ['./paripasu-collateral-idd.style.scss'],
})
export class ParipasuCollateralIddComponent implements OnInit {
  public collateralId: any;
  public excludeCif: any;
  dataItem: any;
  @ViewChild('paginator') paginator: MatPaginator;
  public _partyCif: IPartyCif;
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
  public data = [];
  constructor(private crossCollateralService: CrossCollateralService, private partyCifService: PartyCifService) {}
  ngOnInit(): void {
    this.crossCollateralGrid(this.collateral.id, this.partyCif.customerNumber);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['collateral'] && changes['creditProposal']) {
  //     this.crossCollateralGrid(this.collateral.id, this.creditProposal.customerNumber);
  //   }
  //   console.log(changes, 'changesParipasu')
  // }
  public crossCollateralGrid(idCollateral: number, cifNumber: string): void {
    this.crossCollateralService
      .filterTableData({
        page: 0,
        size: 9999,
        collateralId: idCollateral,
        excludeCif: cifNumber,
      })
      .subscribe(res => {
        this.data = res.body;
        this.dataItem = new MatTableDataSource(res.body);
        this.dataItem.paginator = this.paginator;
      });
  }
}
