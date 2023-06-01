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
    this.productCategoryService
      .query({
        // idProduct: this.productParameter.id,
        page: 0,
        size: 9999,
        sort: ['asc'],
      })
      .subscribe(res => {
        this.categoryList = res.body.filter(
          (product, index, arr) => !this.categoryListGrid.includes(product.id) && arr.findIndex(p => p.id === product.id) === index
        );
        console.log('category List', this.categoryList);
        // const data = res.body;
        // if (data.length > 0) {
        //   for (let i = 0; i < data.length; i++) {
        //     for (let j = 0; j < this.categoryListGrid.length; j++) {
        //       if (data[i].id !== this.categoryListGrid[j].categoryId) {
        //         this.categoryList.push(data[i].id);
        //       }
        //     }
        //   }
        // }
        // this.categoryList = res.body.filter(o => {
        //   o.id !== this.categoryListGrid.forEach(e => e.categoryId);
        // });

        // this.categoryList = lodash.filter(res.body, o => o.id !== this.categoryListGrid['categoryId']);
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
