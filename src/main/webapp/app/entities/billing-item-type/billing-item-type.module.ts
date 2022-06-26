import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillingItemTypeComponent } from './billing-item-type.component';
import { BillingItemTypeDetailComponent } from './billing-item-type-detail.component';
import { BillingItemTypeUpdateComponent } from './billing-item-type-update.component';
import { billingItemTypeRoute } from './billing-item-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billingItemTypeRoute)],
  declarations: [BillingItemTypeComponent, BillingItemTypeDetailComponent, BillingItemTypeUpdateComponent],
  entryComponents: [BillingItemTypeComponent, BillingItemTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillingItemTypeModule {}
