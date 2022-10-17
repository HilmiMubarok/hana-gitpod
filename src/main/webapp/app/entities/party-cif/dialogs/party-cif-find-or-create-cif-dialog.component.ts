import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartyCifService } from '../party-cif.service';

@Component({
  selector: 'jhi-party-cif-find-or-create-cif-dialog',
  templateUrl: './party-cif-find-or-create-cif-dialog.component.html',
})
export class PartyCifFindOrCreateCifDialogComponent {
  public cif: string;
  constructor(
    private partyCifService: PartyCifService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialogRef<PartyCifFindOrCreateCifDialogComponent>
  ) {}

  public search(): void {
    this.partyCifService.findCif(this.cif).subscribe(res => {
      if (res.body) {
        this._dialog.close(res.body);
      } else {
        this._snackBar.open(`Cif with number ${this.cif} is not exist!`, null, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000,
        });
      }
    });
  }
}
