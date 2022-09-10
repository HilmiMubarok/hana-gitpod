import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { FACILITY_TYPE } from '../../../../shared/constants/base.constants';

@Component({
  selector: 'jhi-slik-summary-debitur-dialog',
  templateUrl: './slik-summary-debitur-dialog.component.html',
})
export class SlikSummaryDebiturDialogComponent {
  public partySlik: IPartySlik;
  public facility_types: any = FACILITY_TYPE;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partySlik: IPartySlik;
    },
    private _dialog: MatDialogRef<SlikSummaryDebiturDialogComponent>
  ) {
    this.partySlik = this.data.partySlik;
  }

  public save(): void {
    this._dialog.close(this.partySlik);
  }
}
