import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCategoryTypeComponent } from './product-category-type.component';
import { ProductCategoryTypeDetailComponent } from './product-category-type-detail.component';
import { ProductCategoryTypeUpdateComponent } from './product-category-type-update.component';
import { productCategoryTypeRoute } from './product-category-type.route';
import { ProductCategoryTypeViewComponent } from './product-category-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productCategoryTypeRoute)],
  declarations: [
    ProductCategoryTypeComponent,
    ProductCategoryTypeDetailComponent,
    ProductCategoryTypeUpdateComponent,
    ProductCategoryTypeViewComponent,
  ],
  entryComponents: [ProductCategoryTypeComponent, ProductCategoryTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductCategoryTypeModule {}
