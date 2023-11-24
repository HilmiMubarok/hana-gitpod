import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'jhi-compare-data-covenant-other-dialog',
  template: `
    <h2 mat-dialog-title class="header-title"></h2>
    <mat-dialog-content>
      <div class="fontsebled row">
        <div class="col-3">Covenant</div>
        <div class="col-md-auto">:</div>
        <div class="col">
          {{ otherCovenant.covenant }}
        </div>
      </div>
      <div class="fontsebled row">
        <div class="col-3">Category</div>
        <div class="col-md-auto">:</div>
        <div class="col">
          {{ otherCovenant.category }}
        </div>
      </div>
      <div class="fontsebled row">
        <div class="col-3">Sub Category</div>
        <div class="col-md-auto">:</div>
        <div class="col">
          {{ otherCovenant.sub_category }}
        </div>
      </div>
      <div class="fontsebled row">
        <div class="col-3">Status</div>
        <div class="col-md-auto">:</div>
        <div class="col">
          {{ otherCovenant.status }}
        </div>
      </div>
      <div class="fontsebled row">
        <div class="col-3">Deviation</div>
        <div class="col-md-auto">:</div>
        <div class="col">
          {{ otherCovenant.deviation }}
        </div>
      </div>

      <div class="fontsebled row">
        <div class="col-3">Justification</div>
        <div class="col-md-auto">:</div>
        <div class="col">
          {{ otherCovenant.justification }}
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="center" class="align-center">
      <button mat-button mat-dialog-close class="confirm-button-no">Close</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['../../../../credit-proposal/convenant/other-covenant/other-covenant.css'],
})
export class CompareDataCovenantOtherDialogComponent {
  otherCovenant: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      item: any;
    },
    private _dialog: MatDialogRef<CompareDataCovenantOtherDialogComponent>
  ) {
    this.otherCovenant = this.data.item;
  }
}
