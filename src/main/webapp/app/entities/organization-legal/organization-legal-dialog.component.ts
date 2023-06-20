import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IOrganizationLegal } from './organization-legal.model';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import moment from 'moment';
import { FormControl } from '@angular/forms';
import { Input } from '@syncfusion/ej2-angular-inputs';
import { TemplateService } from 'app/layouts/template/template.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

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
  styleUrls: ['../party-cif/party-cif.style.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class OrganizationLegalDialogComponent implements OnInit {
  public organizationLegal: IOrganizationLegal;
  public managementType: string;
  moment = _rollupMoment || _moment;
  date = new FormControl(moment());

  constructor(
    private templateService: TemplateService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      organizationLegal: IOrganizationLegal;
      deedNumber: any;
      deedDates: any;
    },
    private _dialog: MatDialogRef<OrganizationLegalDialogComponent>
  ) {
    this.organizationLegal = this.data.organizationLegal;
    if (this.organizationLegal.deedEstablishNum === '' || this.organizationLegal.deedEstablishNum === undefined) {
      this.organizationLegal.deedEstablishNum = this.data.deedNumber;
    }
    this.organizationLegal.deedEstablishDate = this.data.deedDates;
  }

  ngOnInit(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.checkRole(newPos.positionTypeId);
    });
    this.changeNumber();
    this.changeDate();
  }
  // IDD organization Legal
  public checkRole(param): void {
    if (param === 'RM') {
      this._dialog.disableClose = true;
      this._dialog.backdropClick().subscribe(_ => {
        this.openCancelDialog();
      });
    }
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

  public changeNumber() {
    if (this.organizationLegal.deedRecentChangeNumber === null || this.organizationLegal.deedRecentChangeNumber === undefined) {
      return 'N/A';
    }
    return this.organizationLegal.deedRecentChangeNumber;
  }
  public changeDate() {
    if (this.organizationLegal.deedRecentChangeDate === null) {
      return 'N/A';
    }
    return this.organizationLegal.deedRecentChangeDate;
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
        this._dialog.close();
      }
    });
  }
}
