import { Component, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralAppraisal } from 'app/entities/collateral-appraisal/collateral-appraisal.model';
import { ICollateral } from 'app/entities/collateral/collateral.model';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { IPartyCif } from '../party-cif.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-cif-collateral-info-dialog',
  templateUrl: './collateral-info-dialog.component.html',
  styleUrls: ['./collateral-info.style.scss'],
})
export class PartyCifCollateralInfoDialogComponent {
  public collateral: ICollateral;
  public partyCif: IPartyCif;
  @Input() collateralAppraisal: ICollateralAppraisal;
  public disabledOpt = false;
  public collateralDetails: object[];

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      collateral: ICollateral;
      collateralAppraisal: ICollateralAppraisal;
      partyCif: IPartyCif;
    },
    private _dialog: MatDialogRef<PartyCifCollateralInfoDialogComponent>,
    private messageService: MessageService
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.collateral = this.data.collateral;
    this.partyCif = this.data.partyCif;
    this.collateralAppraisal = this.data.collateralAppraisal;
    this.collateralDetails = [];
  }

  public dataSource() {
    if (this.collateral.dataSource === 'h' || this.collateral.dataSource === 'H') {
      return true;
    }
    return false;
  }

  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }

  public saveCGPG() {
    if (!this.collateral.attributes.collateralCode) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please fill in  Collateral Code field first ',
      });
      return;
    } else {
      this._dialog.close(this.collateral);
    }
  }
  public save() {
    if (!this.collateral.collateralConditions) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please select Collateral Condition first ',
      });
      return;
    } else if (!this.collateral.attributes.collateralCode) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please fill in  Collateral Code field first ',
      });
      return;
    } else {
      this._dialog.close(this.collateral);
    }
  }
  public onSave() {
    if (this.collateral.collateralTypeId === 'CORPORATEPERSONALGUARANTEE') {
      this.saveCGPG();
    } else {
      this.save();
    }
  }
}
