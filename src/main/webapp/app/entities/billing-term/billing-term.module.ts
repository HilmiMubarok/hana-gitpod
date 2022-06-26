import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { BillingTermComponent } from './billing-term.component';
import { BillingTermDetailComponent } from './billing-term-detail.component';
import { BillingTermUpdateComponent } from './billing-term-update.component';
import { billingTermRoute } from './billing-term.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(billingTermRoute)],
  declarations: [BillingTermComponent, BillingTermDetailComponent, BillingTermUpdateComponent],
  entryComponents: [BillingTermComponent, BillingTermUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwBillingTermModule {}
