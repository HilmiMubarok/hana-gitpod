import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { BindingValueInformationDialogComponent } from '../binding-value-information-dialog.component';
import { BindingValueRealEstateDialogComponent } from './binding-value-real-estate-dialog.component';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';
import { FidusiaAgreementService } from 'app/entities/fidusia-agreement/fidusia-agreement.service';
import { FidusiaAgreement, IFidusiaAgremeent } from 'app/entities/fidusia-agreement/fidusia-agreement.model';

@Component({
  selector: 'jhi-binding-value-real-estate-grid',
  templateUrl: './binding-value-real-estate-grid.component.html',
  styleUrls: ['../../../collateral-info-cp.style.scss'],
})
export class BindingValueRealEstateGridComponent implements OnInit {
  constructor(
    private collateralService: CollateralService,
    public dialog: MatDialog,
    protected fidusiaAgreementService: FidusiaAgreementService
  ) {}

  _creditProposal: ICreditProposal;

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
  set collateral(item: ICollateral) {
    this._collateral = item;
  }

  public displayedColumns: string[] = ['no', 'rank', 'binding-value', 'binding-number', 'binding-date', 'cover', 'action'];

  public dataItem;

  ngOnInit(): void {
    this.getFidusiaData();
  }

  public getFidusiaData() {
    this.fidusiaAgreementService.getData(this.creditProposal.id, this.collateral.id).subscribe(res => {
      this.dataItem = new MatTableDataSource(res);
      this.dataItem.paginator = this.paginator;
    });
  }

  public openDialog(element?: IFidusiaAgremeent) {
    let fidusiaItem: IFidusiaAgremeent = new FidusiaAgreement();
    if (!element) {
      this.fidusiaAgreementService.getTemplate(this.creditProposal.id, this.collateral.id).subscribe(res => {
        fidusiaItem = res;
        console.log('res item ', fidusiaItem);
      });
    }
    const dialogRef = this.dialog.open(BindingValueRealEstateDialogComponent, {
      width: '80vw',
      data: {
        item: fidusiaItem,
        creditProposaldata: this.creditProposal,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}
