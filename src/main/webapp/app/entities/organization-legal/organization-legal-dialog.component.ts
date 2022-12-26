import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOrganizationLegal } from './organization-legal.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY/MM/DD',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY/MM/DD',
  },
};
@Component({
  selector: 'jhi-organization-legal-dialog',
  templateUrl: './organization-legal-dialog.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OrganizationLegalDialogComponent {
  public organizationLegal: IOrganizationLegal;
  public managementType: string;
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationLegal: IOrganizationLegal;
    },
    private _dialog: MatDialogRef<OrganizationLegalDialogComponent>
  ) {
    this.organizationLegal = this.data.organizationLegal;
  }

  public dataSource() {
    if (this.organizationLegal.dataSource === 'h' || this.organizationLegal.dataSource === 'H') {
      return true;
    }
    return false;
  }

  public save(): void {
    this._dialog.close(this.organizationLegal);
  }
}
