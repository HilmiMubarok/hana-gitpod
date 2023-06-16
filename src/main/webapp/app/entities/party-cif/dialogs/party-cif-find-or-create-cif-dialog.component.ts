import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartyCifService } from '../party-cif.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-party-cif-find-or-create-cif-dialog',
  templateUrl: './party-cif-find-or-create-cif-dialog.component.html',
})
export class PartyCifFindOrCreateCifDialogComponent {
  public cif: string;
  constructor(
    private partyCifService: PartyCifService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialogRef<PartyCifFindOrCreateCifDialogComponent>,
    public messageService: MessageService
  ) {}

  public search(): void {
    this.partyCifService.cashFindCif(this.cif, { idPosition: this.getLocStor('POS') }).subscribe(
      res => {
        if (res.body) {
          const snackBarRef = this._snackBar.open(`Cif Success`, null, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
          });
          snackBarRef.afterDismissed().subscribe(() => {
            this._dialog.close(res.body);
          });
        } else {
          this._snackBar.open(`Cif with number ${this.cif} does not exist!`, null, {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000,
          });
        }
      },
      error => {
        // Mengembalikan respons error dari backend
        console.log('error', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.title,
        });
      }
    );
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }
}
