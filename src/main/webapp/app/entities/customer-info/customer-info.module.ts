import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerInfoComponent } from './customer-info.component';
import { CustomerInfoDetailComponent } from './customer-info-detail.component';
import { CustomerInfoUpdateComponent } from './customer-info-update.component';
import { customerInfoRoute } from './customer-info.route';
import { CustomerInfoViewComponent } from './customer-info-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(customerInfoRoute)],
  declarations: [CustomerInfoComponent, CustomerInfoDetailComponent, CustomerInfoUpdateComponent, CustomerInfoViewComponent],
  entryComponents: [CustomerInfoComponent, CustomerInfoUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCustomerInfoModule {}
