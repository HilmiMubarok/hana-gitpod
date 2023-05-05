import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProductClassification } from 'app/entities/product-classification/product-classification.model';
import { IMasterProductParameter } from '../master-product-parameter.model';
import { ProductClassificationService } from 'app/entities/product-classification/product-classification.service';
import lodash from 'lodash';

@Component({
  selector: 'jhi-category-product-dialog',
  templateUrl: './category-product-dialog.component.html',
})
export class CategoryProductDialogComponent implements OnInit {
  public productClasification: IProductClassification;

  public categoryList = [];
  public categoryListGrid = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      productClasification: IProductClassification;
      productId: IMasterProductParameter;
    },
    private _dialog: MatDialogRef<CategoryProductDialogComponent>,
    protected productClasificationService: ProductClassificationService
  ) {
    this.productClasification = this.data.productClasification;
    console.log('category', this.data.productId.id);
  }
  ngOnInit(): void {
    this.getIdProduct();
    this.getProductClasification();
    this.getProductCategory();
  }

  public getProductClasification() {
    this.productClasificationService
      .queryFilterBy({
        idProduct: this.productClasification.productId,
        page: 0,
        size: 9999,
        sort: ['asc'],
      })
      .subscribe(ress => {
        const data = ress.body;
        for (let i = 0; i < data.length; i++) {
          this.categoryListGrid.push(data[i].categoryId);
        }
      });
  }

  public getProductCategory() {
    this.productClasificationService
      .query({
        // idProduct: this.productParameter.id,
        page: 0,
        size: 9999,
        sort: ['asc'],
      })
      .subscribe(res => {
        this.categoryList = res.body.filter(
          (product, index, arr) =>
            !this.categoryListGrid.includes(product.categoryId) && arr.findIndex(p => p.categoryId === product.categoryId) === index
        );
        console.log(this.categoryList);
      });
  }

  public getIdProduct() {
    this.productClasification.productId = this.data.productId.id.toString();
    this.productClasification.productName = this.data.productId.name;
  }
  public save(): void {
    // console.log('cek save', this.productClasification)
    this._dialog.close(this.productClasification);
  }
}
