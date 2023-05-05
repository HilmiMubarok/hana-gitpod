import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_PARAMETER } from 'app/shared/constants/status.constants';
import { IProductCategory } from './product-category.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'jhi-product-category-dialog.component',
  templateUrl: './product-category-dialog.component.html',
})
export class ProductCategoryDialogComponent {
  public productParameter: IProductCategory;
  public statuses: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productParameter: IProductCategory;
    },
    private _dialog: MatDialogRef<ProductCategoryDialogComponent>
  ) {
    this.productParameter = this.data.productParameter;
    this.statuses = STATUS_PARAMETER;
  }

  public save(): void {
    this._dialog.close(this.productParameter);
  }
}
