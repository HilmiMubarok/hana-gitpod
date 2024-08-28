import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerInfoComponent } from './customer-info.component';
import { CustomerInfoDetailComponent } from './customer-info-detail.component';
import { CustomerInfoUpdateComponent } from './customer-info-update.component';
import { customerInfoRoute } from './customer-info.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(customerInfoRoute)],
  declarations: [CustomerInfoComponent, CustomerInfoDetailComponent, CustomerInfoUpdateComponent],
  entryComponents: [CustomerInfoComponent, CustomerInfoUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCustomerInfoModule {}
