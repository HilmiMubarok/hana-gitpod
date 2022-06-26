import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProductCategoryComponent } from './product-category.component';
import { ProductCategoryDetailComponent } from './product-category-detail.component';
import { ProductCategoryUpdateComponent } from './product-category-update.component';
import { productCategoryRoute } from './product-category.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(productCategoryRoute)],
  declarations: [ProductCategoryComponent, ProductCategoryDetailComponent, ProductCategoryUpdateComponent],
  entryComponents: [ProductCategoryComponent, ProductCategoryUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductCategoryModule {}
