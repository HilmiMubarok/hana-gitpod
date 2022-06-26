import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentGLAccountTypeMapComponent } from './payment-gl-account-type-map.component';
import { PaymentGLAccountTypeMapDetailComponent } from './payment-gl-account-type-map-detail.component';
import { PaymentGLAccountTypeMapUpdateComponent } from './payment-gl-account-type-map-update.component';
import { paymentGLAccountTypeMapRoute } from './payment-gl-account-type-map.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(paymentGLAccountTypeMapRoute)],
  declarations: [PaymentGLAccountTypeMapComponent, PaymentGLAccountTypeMapDetailComponent, PaymentGLAccountTypeMapUpdateComponent],
  entryComponents: [PaymentGLAccountTypeMapComponent, PaymentGLAccountTypeMapUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPaymentGLAccountTypeMapModule {}
