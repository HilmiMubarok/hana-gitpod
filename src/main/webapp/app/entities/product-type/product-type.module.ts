import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeComponent } from './product-type.component';
import { ProductTypeDetailComponent } from './product-type-detail.component';
import { ProductTypeUpdateComponent } from './product-type-update.component';
import { productTypeRoute } from './product-type.route';
import { ProductTypeViewComponent } from './product-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(productTypeRoute)],
  declarations: [ProductTypeComponent, ProductTypeDetailComponent, ProductTypeUpdateComponent, ProductTypeViewComponent],
  entryComponents: [ProductTypeComponent, ProductTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductTypeModule {}
