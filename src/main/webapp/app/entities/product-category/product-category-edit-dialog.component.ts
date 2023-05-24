import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IProductCategory } from './product-category.model';
import { FormControl } from '@angular/forms';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';

@Component({
  selector: 'jhi-product-category-edit-dialog',
  templateUrl: './product-category-edit-dialog.component.html',
})
export class ProductCategoryEditDialogComponent {
  public productParameter: IProductCategory;
  public statuses: any;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productParameter: IProductCategory;
    },
    private _dialog: MatDialogRef<ProductCategoryEditDialogComponent>
  ) {
    _dialog.disableClose = true;
    this.productParameter = this.data.productParameter;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.productParameter);
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
