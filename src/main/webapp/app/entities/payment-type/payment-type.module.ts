import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentTypeComponent } from './payment-type.component';
import { PaymentTypeDetailComponent } from './payment-type-detail.component';
import { PaymentTypeUpdateComponent } from './payment-type-update.component';
import { paymentTypeRoute } from './payment-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(paymentTypeRoute)],
  declarations: [PaymentTypeComponent, PaymentTypeDetailComponent, PaymentTypeUpdateComponent],
  entryComponents: [PaymentTypeComponent, PaymentTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPaymentTypeModule {}
