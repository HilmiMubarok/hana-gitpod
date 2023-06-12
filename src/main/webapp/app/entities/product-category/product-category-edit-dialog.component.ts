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
  public statusValue = [
    {
      statusId: 'ACTIVE',
      statusDescription: 'Active',
      statusCode: 'ACTIVE',
    },
    {
      statusId: 'NON_ACTIVE',
      statusDescription: 'Non Active',
      statusCode: 'NON_ACTIVE',
    },
  ];
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productParameter: IProductCategory;
    },
    private _dialog: MatDialogRef<ProductCategoryEditDialogComponent>
  ) {
    _dialog.disableClose = true;
    _dialog.backdropClick().subscribe(_ => {
      this.openCancelDialog();
    });
    this.productParameter = this.data.productParameter;
    this.setStatus();
  }

  public setStatus(): void {
    if (this.productParameter.statusId === '' || this.productParameter.statusId === null) {
      this.productParameter.statusId = '';
    }
  }

  public save(): void {
    this._dialog.close(this.productParameter);
  }

  // cancel confrimation dialog
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
}
