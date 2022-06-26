import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillingItemTypeMapComponent } from './billing-item-type-map.component';
import { BillingItemTypeMapDetailComponent } from './billing-item-type-map-detail.component';
import { BillingItemTypeMapUpdateComponent } from './billing-item-type-map-update.component';
import { billingItemTypeMapRoute } from './billing-item-type-map.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billingItemTypeMapRoute)],
  declarations: [BillingItemTypeMapComponent, BillingItemTypeMapDetailComponent, BillingItemTypeMapUpdateComponent],
  entryComponents: [BillingItemTypeMapComponent, BillingItemTypeMapUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillingItemTypeMapModule {}
