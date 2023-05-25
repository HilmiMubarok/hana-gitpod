import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif.model';
import { PartyCifService } from '../party-cif.service';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-party-cif-business-group-dialog',
  templateUrl: './party-cif-business-group-dialog.component.html',
})
export class PartyCifBusinessGroupDialogComponent {
  private dialog: MatDialog;
  public selectedPartyCif: IPartyCif;
  public cif: string;
  public view: boolean;
  constructor(private partyCifService: PartyCifService, private _dialog: MatDialogRef<PartyCifBusinessGroupDialogComponent>) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
  }

  public save(): void {
    this._dialog.close(this.selectedPartyCif.debtorData);
  }

  public findCif(): void {
    this.selectedPartyCif = undefined;
    this.partyCifService.findPartyGroupByCif(this.cif).subscribe(res => {
      this.selectedPartyCif = res.body;
    });
  }
  // cancel confrimation dialog
  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '20vw',
      data: {
        title: '',
        message: 'Are you sure to cancel?',
      },
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialog.close();
      }
    });
  }
}
