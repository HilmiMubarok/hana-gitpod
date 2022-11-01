import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollateralLandAttribute } from 'app/entities/collateral/collateral.model';

@Component({
  selector: 'jhi-collateral-land-certification-selection-dialog',
  templateUrl: './collateral-land-certification-selection-dialog.component.html',
})
export class CollateralLandCertificationDialogComponent {
  public dataSource: ICollateralLandAttribute[];
  public displayColumns: string[] = ['select', 'no', 'certNumber'];
  public selection = new SelectionModel<ICollateralLandAttribute>(true, []);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { landCertificates: ICollateralLandAttribute[] },
    private _dialog: MatDialogRef<CollateralLandCertificationDialogComponent>
  ) {
    this.dataSource = this.data.landCertificates;
  }

  public save(): void {
    const selection: ICollateralLandAttribute[] = this.selection.selected;
    this._dialog.close(selection);
  }

  public checkboxLabel(row?: ICollateralLandAttribute): string {
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
}
