import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion',
  templateUrl: './loan-analys-dialog-opinion.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css']
})
export class LoanAnalysDialogOpinionComponent {
  public notes: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: any;
    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionComponent>
  ) { this.notes = this.dataNotes.notes; }
}