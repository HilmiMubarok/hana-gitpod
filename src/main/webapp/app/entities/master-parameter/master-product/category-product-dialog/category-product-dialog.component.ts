import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProductClassification } from 'app/entities/product-classification/product-classification.model';
import { IMasterProductParameter } from '../master-product-parameter.model';

@Component({
  selector: 'jhi-category-product-dialog',
  templateUrl: './category-product-dialog.component.html',
})
export class CategoryProductDialogComponent {
  public productClasification: IProductClassification;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productClasification: IProductClassification;
      productId: IMasterProductParameter;
    },
    private _dialog: MatDialogRef<CategoryProductDialogComponent>
  ) {
    this.productClasification = this.data.productClasification;
    console.log('category', this.data.productId);
  }

  public save(): void {
    this._dialog.close(this.productClasification);
  }
}
