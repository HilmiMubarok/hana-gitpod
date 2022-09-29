import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartySlik } from 'app/entities/party-slik/party-slik.model';
import { FACILITY_TYPE } from '../../../../shared/constants/base.constants';

@Component({
  selector: 'jhi-slik-summary-share-holder-dialog',
  templateUrl: './slik-summary-share-holder-dialog.component.html',
  styleUrls: ['../slik.css'],
})
export class SlikSummaryShareHolderDialogComponent {
  public partySlik: IPartySlik;
  public facility_types: any = FACILITY_TYPE;
  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partySlik: IPartySlik;
      view: boolean;
    },
    private _dialog: MatDialogRef<SlikSummaryShareHolderDialogComponent>
  ) {
    this.view = this.data.view;
    this.partySlik = this.data.partySlik;
  }

  numberInputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return Number(num);
  }

  inputChanged(value) {
    const num = value.replace(/[$,]/g, '');
    return String(num);
  }

  public save(): void {
    this._dialog.close(this.partySlik);
  }
}
