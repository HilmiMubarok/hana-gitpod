import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BindingValueMachineDialogComponent } from './binding-value-machine-dialog.component';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-binding-value-machine-grid',
  templateUrl: './binding-value-machine-grid.component.html',
  styleUrls: ['../../../collateral-info-cp.style.scss'],
})
export class BindingValueMachineGridComponent implements OnInit {
  constructor(private collateralService: CollateralService, public dialog: MatDialog) {}

  _creditProposal: ICreditProposal;

  @ViewChild('paginator') paginator: MatPaginator;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
    this.loadByPartyId(cp.cif.partyId);
  }

  public displayedColumns: string[] = ['no', 'nominal-fidusia', 'no-fidusia', 'tgl-fidusia', 'cover', 'action'];

  public dataItem;

  ngOnInit(): void {
    console.log('test');
  }

  private loadByPartyId(param: string): void {
    this.collateralService
      .queryFilterBy({
        idParty: param,
        isActive: true,
        size: 999,
      })
      .subscribe(res => {
        this.dataItem = new MatTableDataSource(res.body);
        this.dataItem.paginator = this.paginator;
      });
  }

  public openDialog(element?) {
    let data: ICollateral = new Collateral();
    if (element) {
      data = element;
    }
    const dialogRef = this.dialog.open(BindingValueMachineDialogComponent, {
      width: '80vw',
      data: {
        item: data,
        creditProposaldata: this.creditProposal,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}
