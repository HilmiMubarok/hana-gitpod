import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentMethodTypeComponent } from './payment-method-type.component';
import { PaymentMethodTypeDetailComponent } from './payment-method-type-detail.component';
import { PaymentMethodTypeUpdateComponent } from './payment-method-type-update.component';
import { paymentMethodTypeRoute } from './payment-method-type.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(paymentMethodTypeRoute)],
  declarations: [PaymentMethodTypeComponent, PaymentMethodTypeDetailComponent, PaymentMethodTypeUpdateComponent],
  entryComponents: [PaymentMethodTypeComponent, PaymentMethodTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPaymentMethodTypeModule {}
