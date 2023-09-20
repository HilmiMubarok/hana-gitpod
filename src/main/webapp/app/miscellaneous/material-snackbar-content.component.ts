import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'jhi-material-snackbar-content',
  templateUrl: './material-snackbar-content.component.html',
})
export class MaterialSnackbarContentComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
