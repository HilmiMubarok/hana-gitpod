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
export class BindingValueInformationGridComponent implements OnInit {
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
    this.loadByPartyId();
  }

  private loadByPartyId(): void {
    this.collateralService
      .queryFilterBy({
        idParty: this.creditProposal.cif.partyId,
        isActive: true,
        size: 999,
      })
      .subscribe(res => {
        this.dataCollateral = res.body;
        this.dataItem = new MatTableDataSource(res.body);
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
