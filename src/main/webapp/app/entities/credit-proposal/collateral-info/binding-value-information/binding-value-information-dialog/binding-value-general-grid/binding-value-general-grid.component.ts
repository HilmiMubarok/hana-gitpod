import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { FidusiaAgreement, IFidusiaAgremeent } from 'app/entities/fidusia-agreement/fidusia-agreement.model';
import { BindingValueGeneralDialogComponent } from './binding-value-general-dialog.component';
import { FidusiaAgreementService } from 'app/entities/fidusia-agreement/fidusia-agreement.service';
import { ICollateral } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-binding-value-general-grid',
  templateUrl: './binding-value-general-grid.component.html',
  styleUrls: ['../../../collateral-info-cp.style.scss'],
})
export class BindingValueGeneralGridComponent implements OnInit {
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
    if (!element) {
      this.fidusiaAgreementService.getTemplate(this.creditProposal.id, this.collateral.id).subscribe(res => {
        const dialogRef = this.dialog.open(BindingValueGeneralDialogComponent, {
          width: '80vw',
          data: {
            item: res,
            creditProposaldata: this.creditProposal,
          },
        });
        dialogRef.afterClosed().subscribe(res2 => {
          this.fidusiaAgreementService.createData(res2).subscribe(res3 => {
            this.getFidusiaData();
          });
        });
      });
    } else {
      const dialogRef = this.dialog.open(BindingValueGeneralDialogComponent, {
        width: '80vw',
        data: {
          item: element,
          creditProposaldata: this.creditProposal,
        },
      });
      dialogRef.afterClosed().subscribe(res2 => {
        console.log('hasil edit ', res2);
        this.fidusiaAgreementService.updateData(res2.id, res2).subscribe(res3 => {
          this.getFidusiaData();
        });
      });
    }
  }
}
