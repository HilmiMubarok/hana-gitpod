import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { IFidusiaAgremeent } from 'app/entities/fidusia-agreement/fidusia-agreement.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import moment from 'moment';
import lodash from 'lodash';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MenuEventArgs } from '@syncfusion/ej2-angular-navigations';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-binding-value-general-dialog-loan-ops',
  templateUrl: './binding-value-general-dialog-loan-ops.component.html',
  styleUrls: ['../binding-value-information-dialog-loan-ops.component.scss'],
})
export class BindingValueGeneralDialogLoanOpsComponent implements OnInit {
  public dataCollateral: ICollateral;
  public dataFidusia: IFidusiaAgremeent;
  public creditProposal: ICreditProposal;
  public lovRank = [];
  date = new FormControl();

  public bindingTypesHobies = [];
  public textBoxHidden = false;
  public statusDisabledOffering = false;
  public parentPath = this.router.url.split('/')[1];
  public selectedMenu: string;
  isLabel: boolean;
  isElement: boolean;
  public selectMenuItem(args: MenuEventArgs): void {
    this.selectedMenu = args.item.text;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: IFidusiaAgremeent;
      creditProposaldata: ICreditProposal;
      isLabel: false;
      isElement: false;
    },
    private router: Router,
    private generalParameterService: GeneralParameterService,
    private dialog: MatDialog,
    private _dialog: MatDialogRef<BindingValueGeneralDialogLoanOpsComponent>
  ) {
    this.dataFidusia = data.item;
    this.creditProposal = data.creditProposaldata;
    this.isLabel = data.isLabel;
    this.isElement = data.isElement;
  }

  ngOnInit(): void {
    this.addLovRank();
    this.conditionFieldInOfferingLetter();
  }

  public setRank() {
    if (typeof this.dataFidusia.rank === 'number') {
      if (this.dataFidusia.rank < 10) {
        const code: string = '0' + this.dataFidusia.rank;
        if (this.dataFidusia.rank) {
          this.dataFidusia.rank = this.lovRank.find(obj => obj.code === code).code;
        }
      } else {
        const code: string = this.dataFidusia.rank.toString();
        this.dataFidusia.rank = this.lovRank.find(obj => obj.code === code).code;
      }
    }
  }

  public addLovRank() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'RANK',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.lovRank = lodash.filter(res.body, o => o.statusId === 'ACTIVE');
        this.lovRank.sort((a, b) => a.code - b.code);
        this.setRank();
      });
  }

  public save() {
    if (this.dataFidusia.dateAgreement) {
      this.dataFidusia.dateAgreement = moment(new Date(this.dataFidusia.dateAgreement)).format().substring(0, 19) + 'Z';
    }
    this._dialog.close(this.dataFidusia);
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close({
          item: this.dataCollateral,
        });
      }
    });
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
      this.parentPath === 'finalize-dpdl' ||
      this.parentPath === 'review-dpdl' ||
      this.parentPath === 'review-pk' ||
      this.parentPath === 'dar-revision-checker'
    ) {
      this.textBoxHidden = false;
      this.statusDisabledOffering = true;
    } else if (this.parentPath === 'finalize-pk') {
      if (this.creditProposal.statusId === 'PK_FINALIZE' || this.creditProposal.statusId === 'PK_GENERATED') {
        this.textBoxHidden = false;
        this.statusDisabledOffering = false;
      } else {
        this.textBoxHidden = false;
        this.statusDisabledOffering = true;
      }
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
