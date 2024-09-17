import { Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';
import { left } from '@popperjs/core';
import { FidusiaAgreementService } from 'app/entities/fidusia-agreement/fidusia-agreement.service';
import { FidusiaAgreement, IFidusiaAgremeent } from 'app/entities/fidusia-agreement/fidusia-agreement.model';
import * as uuid from 'uuid';
import { BindingValueDepositoDialogLoanOpsComponent } from './binding-value-deposito-dialog-loan-ops.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'jhi-binding-value-deposito-grid-loan-ops',
  templateUrl: './binding-value-deposito-grid-loan-ops.component.html',
  styleUrls: ['../../../collateral-info-loan-ops.style.scss'],
})
export class BindingValueDepositoGridLoanOpsComponent implements OnInit, OnChanges {
  constructor(
    private collateralService: CollateralService,
    public dialog: MatDialog,
    protected fidusiaAgreementService: FidusiaAgreementService
  ) {}
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;
  _creditProposal: ICreditProposal;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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

  public displayedColumns: string[] = ['no', 'nominal-gadai', 'no-gadai', 'tgl-gadai', 'cover', 'action'];

  public dataItem;

  ngOnInit(): void {
    this.getFidusiaData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isElement']) {
      this.isElement = changes['isElement'].currentValue;
    }
    if (changes['isLabel']) {
      this.isLabel = changes['isLabel'].currentValue;
    }
  }
  public getFidusiaData() {
    this.fidusiaAgreementService.getData(this.creditProposal.id, this._collateral.id).subscribe(res => {
      if (res.body.length > 0) {
        const sortedData = res.body.sort((a, b) => {
          if (a.rank < b.rank) {
            return -1;
          } else if (a.rank > b.rank) {
            return 1;
          } else {
            return 0;
          }
        });
        this.dataItem = sortedData;
        this.dataItem.paginator = this.paginator;
        this.dataItem.sort = this.sort;
      }
    });
  }

  public cekData() {
    this.fidusiaAgreementService.getTemplate(this.creditProposal.id, this.collateral.id).subscribe(res => {
      console.log('ini res', res);
    });
  }

  public openDialog(element?: IFidusiaAgremeent) {
    if (!element) {
      this.fidusiaAgreementService.getTemplate(this.creditProposal.id, this.collateral.id).subscribe(res => {
        const dialogRef = this.dialog.open(BindingValueDepositoDialogLoanOpsComponent, {
          width: '80vw',
          data: {
            item: res,
            creditProposaldata: this.creditProposal,
            isElement: this.isElement,
            isLabel: this.isLabel,
          },
        });
        dialogRef.afterClosed().subscribe(res2 => {
          this.fidusiaAgreementService.createData(res2).subscribe(res3 => {
            this.getFidusiaData();
          });
        });
      });
    } else {
      const dialogRef = this.dialog.open(BindingValueDepositoDialogLoanOpsComponent, {
        width: '80vw',
        data: {
          item: element,
          creditProposaldata: this.creditProposal,
        },
      });
      dialogRef.afterClosed().subscribe(res2 => {
        console.log('hasil edit ', res2);
      });
    }
  }
}
