import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LegendTitle } from '@syncfusion/ej2-angular-charts';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { GeneralParameterService } from 'app/entities/master-parameter/general-parameter/general-parameter.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import lodash from 'lodash';

@Component({
  selector: 'jhi-binding-value-information-dialog-loan-ops',
  templateUrl: './binding-value-information-dialog-loan-ops.component.html',
  styleUrls: ['./binding-value-information-dialog-loan-ops.component.scss'],
})
export class BindingValueInformationDialogLoanOpsComponent implements OnInit {
  public dataCollateral: ICollateral;
  public creditProposal: ICreditProposal;
  public bindingTypesHobies = [];
  public collBindingType: string;
  public parentPath = this.router.url.split('/')[1];
  public guaranteeBindingStatField = true;
  public valueGuaranteeBinding: { id: number; value: string } = { id: 0, value: '' };
  isLabel: boolean;
  isElement: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: ICollateral;
      creditProposaldata: ICreditProposal;
      isLabel: false;
      isElement: false;
    },
    private dialog: MatDialog,
    private router: Router,
    private generalParameterService: GeneralParameterService,
    private _dialog: MatDialogRef<BindingValueInformationDialogLoanOpsComponent>
  ) {
    this.dataCollateral = data.item;
    this.creditProposal = data.creditProposaldata;
    this.isLabel = data.isLabel;
    this.isElement = data.isElement;
  }
  ngOnInit(): void {
    this.lovBindingType();
    this.guaranteeBindingDisable();
    this.cekDataBinding();
  }

  public closeDialog() {
    this._dialog.close({ type: 'close' });
  }

  public save() {
    let guarantee: any;
    if (this.creditProposal.attributes['guaranteeBinding'].length > 0) {
      guarantee = this.creditProposal.attributes['guaranteeBinding'].find(obj => obj.id === this.dataCollateral.id);
      if (guarantee) {
        this.creditProposal.attributes['guaranteeBinding'][
          this.creditProposal.attributes['guaranteeBinding'].findIndex(obj => obj.id === this.dataCollateral.id)
        ] = this.valueGuaranteeBinding;
        this._dialog.close({ type: 'save', item: this.dataCollateral });
      } else {
        this.creditProposal.attributes['guaranteeBinding'].push(this.valueGuaranteeBinding);
        this._dialog.close({ type: 'save', item: this.dataCollateral });
      }
    } else {
      this.creditProposal.attributes['guaranteeBinding'].push(this.valueGuaranteeBinding);
      this._dialog.close({ type: 'save', item: this.dataCollateral });
    }
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
    if (this.parentPath === 'finalize-dpdl' && this.creditProposal.statusId === 'DPDL_FINALIZE') {
      this.guaranteeBindingStatField = false;
    }
  }

  public cekDataBinding() {
    let guarantee: any;
    if (this.creditProposal.attributes['guaranteeBinding'].length > 0) {
      guarantee = this.creditProposal.attributes['guaranteeBinding'].find(obj => obj.id === this.dataCollateral.id);
      if (guarantee) {
        this.valueGuaranteeBinding = guarantee;
      } else {
        this.valueGuaranteeBinding.id = this.dataCollateral.id;
        this.valueGuaranteeBinding.value = '';
      }
    } else {
      this.valueGuaranteeBinding.id = this.dataCollateral.id;
      this.valueGuaranteeBinding.value = '';
    }
  }
}
