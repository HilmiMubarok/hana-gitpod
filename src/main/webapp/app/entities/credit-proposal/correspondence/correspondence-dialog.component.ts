import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICorrespondence } from './correspondence.model';

@Component({
  selector: 'jhi-correspondece-dialog',
  templateUrl: './correspondence-dialog.component.html',
})
export class CorrespondenceDialogComponent {
  public correspondence: ICorrespondence;
  public view: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      correspondence: ICorrespondence;
      view: boolean;
    },
    private _dialog: MatDialogRef<CorrespondenceDialogComponent>
  ) {
    this.view = this.data.view;
    this.correspondence = this.data.correspondence;
  }

  public save(): void {
    this._dialog.close(this.correspondence);
  }
}
