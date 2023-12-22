import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BindingValueInformationDialogComponent } from '../binding-value-information-dialog/binding-value-information-dialog.component';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import lodash from 'lodash';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-binding-value-information-grid',
  templateUrl: './binding-value-information-grid.component.html',
  styleUrls: ['../../collateral-info-cp.style.scss'],
})
export class BindingValueInformationGridComponent implements OnInit, OnChanges {
  constructor(private collateralService: CollateralService, public dialog: MatDialog) {}

  _creditProposal: ICreditProposal;
  private _collateralSummaryData: ICollateral[];

  @ViewChild('paginator') paginator: MatPaginator;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input()
  get collateralSummaryData() {
    return this._collateralSummaryData;
  }

  set collateralSummaryData(item: ICollateral[]) {
    this._collateralSummaryData = item;
  }

  public displayedColumns: string[] = ['no', 'collateralType', 'address', 'action'];

  public dataItem;
  public dataCollateral;

  ngOnInit(): void {
    if (!this.collateralSummaryData) {
      this.loadByPartyId(this.creditProposal);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['collateralSummaryData']) {
      this.dataItem = new MatTableDataSource(this.collateralSummaryData);
      this.dataItem.paginator = this.paginator;
    }
  }

  private loadByPartyId(param: ICreditProposal): void {
    const applicationNumber = param.id;
    this.collateralService.getSummaryCollateral(applicationNumber).subscribe(res => {
      this.dataCollateral = lodash.filter(res.body, function (o) {
        return o.statusId !== STATUS_COLLATERAL.CANCEL && o.statusId !== STATUS_COLLATERAL.RELEASE;
      });
      this.dataItem = new MatTableDataSource(this.dataCollateral);
      this.dataItem.paginator = this.paginator;
    });
  }

  public openDialog(element) {
    const dialogRef = this.dialog.open(BindingValueInformationDialogComponent, {
      width: '80vw',

      data: {
        item: element,
        creditProposaldata: this.creditProposal,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}
