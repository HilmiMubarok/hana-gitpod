import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillingItemComponent } from './billing-item.component';
import { BillingItemDetailComponent } from './billing-item-detail.component';
import { BillingItemUpdateComponent } from './billing-item-update.component';
import { billingItemRoute } from './billing-item.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billingItemRoute)],
  declarations: [BillingItemComponent, BillingItemDetailComponent, BillingItemUpdateComponent],
  entryComponents: [BillingItemComponent, BillingItemUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillingItemModule {}
