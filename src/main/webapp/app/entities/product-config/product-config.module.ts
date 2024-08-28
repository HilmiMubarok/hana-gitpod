import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { ProductConfigComponent } from './product-config.component';
import { ProductConfigDetailComponent } from './product-config-detail.component';
import { ProductConfigUpdateComponent } from './product-config-update.component';
import { productConfigRoute } from './product-config.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(productConfigRoute)],
  declarations: [ProductConfigComponent, ProductConfigDetailComponent, ProductConfigUpdateComponent],
  entryComponents: [ProductConfigComponent, ProductConfigUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwProductConfigModule {}
