import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillingComponent } from './billing.component';
import { BillingDetailComponent } from './billing-detail.component';
import { BillingUpdateComponent } from './billing-update.component';
import { billingRoute } from './billing.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billingRoute)],
  declarations: [BillingComponent, BillingDetailComponent, BillingUpdateComponent],
  entryComponents: [BillingComponent, BillingUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillingModule {}
