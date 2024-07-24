import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCategoryComponent } from './product-category.component';
import { ProductCategoryDetailComponent } from './product-category-detail.component';
import { ProductCategoryUpdateComponent } from './product-category-update.component';
import { productCategoryRoute } from './product-category.route';
import { ProductCategoryViewComponent } from './product-category-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productCategoryRoute)],
  declarations: [ProductCategoryComponent, ProductCategoryDetailComponent, ProductCategoryUpdateComponent, ProductCategoryViewComponent],
  entryComponents: [ProductCategoryComponent, ProductCategoryUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductCategoryModule {}
