import { Component, Input, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { Collateral, ICollateral } from 'app/entities/collateral/collateral.model';
import { FidusiaAgreementService } from 'app/entities/fidusia-agreement/fidusia-agreement.service';
import { FidusiaAgreement, IFidusiaAgremeent } from 'app/entities/fidusia-agreement/fidusia-agreement.model';
import { BindingValueMachineDialogLoanOpsComponent } from './binding-value-machine-dialog-loan-ops.component';

@Component({
  selector: 'jhi-binding-value-machine-grid-loan-ops',
  templateUrl: './binding-value-machine-grid-loan-ops.component.html',
  styleUrls: ['../../../collateral-info-loan-ops.style.scss'],
})
export class BindingValueMachineGridLoanOpsComponent implements OnInit, OnChanges {
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
  @Input() isElement: Boolean = false;
  @Input() isLabel: Boolean = false;
  public displayedColumns: string[] = ['no', 'nominal-fidusia', 'no-fidusia', 'tgl-fidusia', 'cover', 'action'];

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
    this.fidusiaAgreementService.getData(this.creditProposal.id, this.collateral.id, { sort: ['rank,asc'] }).subscribe(res => {
      this.dataItem = new MatTableDataSource(res.body);
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
    const dialogRef = this.dialog.open(BindingValueMachineDialogLoanOpsComponent, {
      width: '80vw',
      data: {
        item: fidusiaItem,
        creditProposaldata: this.creditProposal,
        isElement: this.isElement,
        isLabel: this.isLabel,
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }
}
