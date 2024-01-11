import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';

@Component({
  selector: 'jhi-binding-value-information-dialog',
  templateUrl: './binding-value-information-dialog.component.html',
  styleUrls: ['./binding-value-information-dialog.component.scss'],
})
export class BindingValueInformationDialogComponent implements OnInit {
  public dataCollateral: ICollateral;
  public creditProposal: ICreditProposal;
  public bindingTypesHobies = [];
  public collBindingType: string;
  public parentPath = this.router.url.split('/')[1];
  public guaranteeBindingStatField = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICollateral;
      creditProposaldata: ICreditProposal;
    },
    private dialog: MatDialog,
    private router: Router,
    private generalParameterService: GeneralParameterService,
    private _dialog: MatDialogRef<BindingValueInformationDialogComponent>
  ) {
    this.dataCollateral = data.item;
    this.creditProposal = data.creditProposaldata;
  }
  ngOnInit(): void {
    this.lovBindingType();
    this.guaranteeBindingDisable();
  }

  public closeDialog() {
    this._dialog.close({ type: 'close' });
  }

  public save() {
    this._dialog.close({ type: 'save', item: this.dataCollateral });
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
          type: 'cancel',
          item: this.dataCollateral,
        });
      }
    });
  }

  public lovBindingType() {
    this.generalParameterService
      .queryFilterBy({
        idParameterType: 'COLLATERAL_BINDING_TYPE',
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.bindingTypesHobies = lodash.filter(res.body, function (o) {
          return o.statusId === 'ACTIVE';
        });
        if (this.dataCollateral.collBindingType) {
          this.collBindingType = this.bindingTypesHobies.find(obj => obj.code === this.dataCollateral.collBindingType).value;
        }
      });
  }

  public guaranteeBindingDisable() {
    if (this.parentPath === 'finalize-pk' && this.creditProposal.statusId === 'PK_FINALIZE') {
      this.guaranteeBindingStatField = false;
    } else if (this.parentPath === 'finalize-dpdl' && this.creditProposal.statusId === 'DPDL_FINALIZE') {
      this.guaranteeBindingStatField = false;
    }
  }
}
