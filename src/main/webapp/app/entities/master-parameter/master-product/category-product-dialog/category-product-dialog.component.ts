import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProductClassification } from 'app/entities/product-classification/product-classification.model';
import { IMasterProductParameter } from '../master-product-parameter.model';
import { ProductClassificationService } from 'app/entities/product-classification/product-classification.service';
import lodash from 'lodash';
import { ProductCategoryService } from 'app/entities/product-category/product-category.service';

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
    protected productClasificationService: ProductClassificationService,
    protected productCategoryService: ProductCategoryService
  ) {
    this.productClasification = this.data.productClasification;
  }

  ngOnInit(): void {
    this.getIdProduct();
    this.getProductClasification();
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
        ress.body.forEach(e => this.categoryListGrid.push(e.categoryId));
        this.getProductCategory();
      });
  }

  public getProductCategory() {
    this.productCategoryService
      .query({
        page: 0,
        size: 9999,
        sort: ['asc'],
      })
      .subscribe(res => {
        this.categoryList = res.body.filter(product => !this.categoryListGrid.includes(product.id) && product.statusId === 'ACTIVE');
      });
  }

  public getIdProduct() {
    this.productClasification.productId = this.data.productId.id.toString();
    this.productClasification.productName = this.data.productId.name;
  }
  public save(): void {
    this._dialog.close(this.productClasification);
  }
}
