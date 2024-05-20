import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { ICertificateInfo } from './certificate-info.model';
import { Router } from '@angular/router';
@Component({
  selector: 'jhi-certificate-info-dialog',
  templateUrl: './certificate-info-dialog.component.html',
  styleUrls: ['./certificate-info-dialog.component.scss'],
})
export class CertificateInfoDialogComponent {
  public certificateInfo: ICertificateInfo;
  public parentPath = this.router.url.split('/')[1];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      certifacteInfo: ICertificateInfo;
    },
    private _dialog: MatDialogRef<CertificateInfoDialogComponent>
  ) {
    this.certificateInfo = data.certifacteInfo;
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
        this._dialog.close();
      }
    });
  }

  public save() {
    console.log('certificate ', this.certificateInfo);
    this._dialog.close(this.certificateInfo);
  }
}
