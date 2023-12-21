import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BindingValueInformationDialogComponent } from '../binding-value-information-dialog/binding-value-information-dialog.component';

@Component({
  selector: 'jhi-binding-value-information-grid',
  templateUrl: './binding-value-information-grid.component.html',
  styleUrls: ['../../collateral-info-cp.style.scss'],
})
export class BindingValueInformationGridComponent implements OnInit {
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

  public displayedColumns: string[] = ['no', 'collateralType', 'address', 'action'];

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
