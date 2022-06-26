import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillingTypeComponent } from './billing-type.component';
import { BillingTypeDetailComponent } from './billing-type-detail.component';
import { BillingTypeUpdateComponent } from './billing-type-update.component';
import { billingTypeRoute } from './billing-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billingTypeRoute)],
  declarations: [BillingTypeComponent, BillingTypeDetailComponent, BillingTypeUpdateComponent],
  entryComponents: [BillingTypeComponent, BillingTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillingTypeModule {}
