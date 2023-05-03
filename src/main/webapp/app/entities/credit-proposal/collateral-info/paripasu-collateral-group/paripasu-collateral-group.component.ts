import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';
import { CreditProposalService } from '../../credit-proposal.service';
import { PartyCifService } from 'app/entities/party-cif/party-cif.service';
import { CrossCollateralService } from 'app/entities/cross-collateral/cross-collateral.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-paripasu-collateral-group',
  templateUrl: './paripasu-collateral-group.component.html',
  styleUrls: ['../collateral-info-cp.style.scss'],
})
export class ParipasuCollateralGroupComponent implements OnInit {
  private _creditProposal: ICreditProposal;
  public collateralId: any;
  public excludeCif: any;
  dataItem: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
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
  constructor(
    private crossCollateralService: CrossCollateralService,
    private partyCifService: PartyCifService,
    private creditProposalService: CreditProposalService
  ) {}
  ngOnInit(): void {
    this.crossCollateralGrid(this.collateral.id, this.creditProposal.customerNumber);
    console.log('dataCrossCollateral', this.dataItem);
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
