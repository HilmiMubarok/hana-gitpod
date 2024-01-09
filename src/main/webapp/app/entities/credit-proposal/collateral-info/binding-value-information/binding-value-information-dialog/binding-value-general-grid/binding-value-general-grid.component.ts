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
import { Router } from '@angular/router';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'jhi-binding-value-general-grid',
  templateUrl: './binding-value-general-grid.component.html',
  styleUrls: ['../../../collateral-info-cp.style.scss'],
})
export class BindingValueGeneralGridComponent implements OnInit {
  constructor(
    private collateralService: CollateralService,
    private router: Router,
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

  public textBoxHidden = false;
  public statusDisabledOffering = false;
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  ngOnInit(): void {
    this.getFidusiaData();
    this.conditionFieldInOfferingLetter();
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

  public conditionFieldInOfferingLetter() {
    const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
    const subroutes = queryParam.get('subroute');
    // Condition Offering Letter in Route Finalize
    if (this.parentPath === 'finalize') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and can be changed
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = false;
      }

      // Condition Offering Letter in Route Distribution
    } else if (this.parentPath === 'distribution') {
      // If Selected Menu Loan Facility Detail and not from Loan Facility, the fields can be displayed and cannot be changed
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
        // If the Menu Compare Approval Report field can be displayed and cannot be changed
      } else if (this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = true;
      }

      // Condition Offering Letter in Route Review
    } else if (this.parentPath === 'review' || this.parentPath === 'confirmation') {
      if (this.selectedMenu === 'loan-facility-detail' || this.selectedMenu === 'compare-approval-report') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      } else {
        this.textBoxHidden = true;
        this.statusDisabledOffering = true; // Menambahkan perubahan di sini
      }
    } else if (
      this.parentPath === 'finalize-pk' ||
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'dar-revision-checker'
    ) {
      this.textBoxHidden = false;
      this.statusDisabledOffering = true;
    } else if (this.parentPath === 'dar-revision') {
      if (this.selectedMenu === 'INFORMATION') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
      } else {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      }
    } else {
      this.textBoxHidden = true;
      this.statusDisabledOffering = true; // Menambahkan perubahan di sini
    }
  }
}
