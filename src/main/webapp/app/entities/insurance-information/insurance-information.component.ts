import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import lodash from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { CollateralService } from 'app/entities/collateral/collateral.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { InsuranceInfoDialogComponent } from './dialog/insurance-info-dialog.component';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { CreditProposalService } from '../credit-proposal/credit-proposal.service';
import { IInsuranceInformation } from './insurance-information.model';
import { STATUS_COLLATERAL } from 'app/shared/constants/status.constants';
import { CashCollateralService } from '../cash-collateral/cash-collateral.service';
@Component({
  selector: 'jhi-insurance-information',
  templateUrl: './insurance-information.component.html',
})
export class insuranceInformationComponent extends AbstractEntityMaterialComponent<ICollateral> implements OnInit {
  public displayedColumns: string[] = ['no', 'collateralNumber', 'collateralType', 'collateralAddress', 'action'];

  private _creditProposal: ICreditProposal;

  @Input() parentSource?: String = '';
  public dataSource: any;
  dataItem: ICollateral[];
  insurance: IInsuranceInformation;

  @Input()
  get creditProposal() {
    return this._creditProposal;
  }
  set creditProposal(cp: ICreditProposal) {
    this._creditProposal = cp;
  }

  @Input() isViewMode;

  constructor(
    protected _snackbar: MatSnackBar,
    public dialog: MatDialog,
    private creditProposalService: CreditProposalService,
    private collateralService: CollateralService,
    private cashCollateralService: CashCollateralService
  ) {
    super(_snackbar, collateralService);
    this.itemsPerPage = 10;
    this.page = 0;
  }

  ngOnInit(): void {
    this.loadByPartyId();
    console.log('dataSource', this.dataSource);
  }
  private loadByPartyId(): void {
    const idCP = this.creditProposal.id;
    this.cashCollateralService.loadCollateralInsurance(idCP).subscribe(res => {
      this.dataItem = res.body;
      this.dataSource = new MatTableDataSource(this.dataItem);
      this.dataSource.paginator = this.paginator;
    });
  }
  public openDialog(element: ICollateral): void {
    const predicate: object = {
      width: '80vw',
      data: {
        cp: this.creditProposal,
        collateral: element,
        isViewMode: this.isViewMode,
        parentSource: this.parentSource,
        insurance: this.insurance,
      },
    };
    const dialogRef = this.dialog.open(InsuranceInfoDialogComponent, predicate);
    dialogRef.afterClosed().subscribe(res => {});
  }
}
