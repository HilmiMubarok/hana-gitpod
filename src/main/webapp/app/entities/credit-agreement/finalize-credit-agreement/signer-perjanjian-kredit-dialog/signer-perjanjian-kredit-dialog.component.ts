import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-signer-perjanjian-kredit',
  templateUrl: './signer-perjanjian-kredit-dialog.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class SignerPerjanjialKreditDialogComponent {
  public name: string;
  public debitor: string;
  public position: string;
  constructor(public dialogRef: MatDialogRef<SignerPerjanjialKreditDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  public onSelectPositon(event: any) {
    this.position = event.value;
  }

  onSave(): void {
    this.dialogRef.close({
      name: this.name,
      debitor: this.debitor,
      position: this.position,
    });
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
}
