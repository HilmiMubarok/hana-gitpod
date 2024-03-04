import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';
import moment from 'moment';
import { FidusiaAgreement, IFidusiaAgremeent } from 'app/entities/fidusia-agreement/fidusia-agreement.model';

@Component({
  selector: 'jhi-binding-value-deposito-dialog-loan-ops',
  templateUrl: './binding-value-deposito-dialog-loan-ops.component.html',
  styleUrls: ['../binding-value-information-dialog-loan-ops.component.scss'],
})
export class BindingValueDepositoDialogLoanOpsComponent implements OnInit {
  public dataCollateral: ICollateral;
  public dataFidusia: IFidusiaAgremeent;
  public creditProposal: ICreditProposal;
  public lovRank = [];
  date = new FormControl();
  isLabel: boolean;
  isElement: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: IFidusiaAgremeent;
      creditProposaldata: ICreditProposal;
      isLabel: false;
      isElement: false;
    },
    private generalParameterService: GeneralParameterService,
    private dialog: MatDialog,
    private _dialog: MatDialogRef<BindingValueDepositoDialogLoanOpsComponent>
  ) {
    this.dataFidusia = data.item;
    this.creditProposal = data.creditProposaldata;
    this.isLabel = data.isLabel;
    this.isElement = data.isElement;
    this.addLovRank();
  }

  ngOnInit(): void {
    console.log('test', this.dataFidusia);
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
      });
  }

  public save() {
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
}
