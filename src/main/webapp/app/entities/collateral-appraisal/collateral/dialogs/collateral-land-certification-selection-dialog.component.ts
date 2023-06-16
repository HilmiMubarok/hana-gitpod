import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';
import { ICollateralAppraisal } from '../../collateral-appraisal.model';
import { STATUS } from 'app/shared/constants/status.constants';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { TemplateService } from 'app/layouts/template/template.service';

@Component({
  selector: 'jhi-collateral-land-certification-selection-dialog',
  templateUrl: './collateral-land-certification-selection-dialog.component.html',
  styleUrls: ['./collateral-land-certification-selection-dialog.style.css'],
})
export class CollateralLandCertificationDialogComponent implements OnInit {
  @Input() collateralAppraisal: ICollateralAppraisal;
  public dataSource: ICollateralLandAttribute[];
  public displayColumns: string[] = ['select', 'no', 'certNumber'];
  public selection = new SelectionModel<ICollateralLandAttribute>(true, []);
  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { landCertificates: ICollateralLandAttribute[]; collateralAppraisal: ICollateralAppraisal },
    private _dialog: MatDialogRef<CollateralLandCertificationDialogComponent>
  ) {
    this.dataSource = this.data.landCertificates;
    this.collateralAppraisal = this.data.collateralAppraisal;
  }

  ngOnInit(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
  }

  public checkRole(param): void {
    if (param === 'SURVEYOR' || param === 'TL' || param === 'APR_DEPT_HEAD') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
  }

  public cancel(): void {
    this._dialog.close(this.dataSource);
  }

  // cancel confrimation dialog
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
        this._dialog.close(this.dataSource);
      }
    });
  }
  public save(): void {
    const selection: ICollateralLandAttribute[] = this.selection.selected;
    this._dialog.close(selection);
  }

  public checkboxLabel(row?: ICollateralLandAttribute): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  hideordisable() {
    if (this.collateralAppraisal.statusId === STATUS.APPROVE || this.collateralAppraisal.statusId === STATUS.COMPLETE) {
      return true;
    }
    return false;
  }
}
