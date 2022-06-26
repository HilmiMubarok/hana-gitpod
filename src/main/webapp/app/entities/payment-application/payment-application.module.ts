import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentApplicationComponent } from './payment-application.component';
import { PaymentApplicationDetailComponent } from './payment-application-detail.component';
import { PaymentApplicationUpdateComponent } from './payment-application-update.component';
import { paymentApplicationRoute } from './payment-application.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(paymentApplicationRoute)],
  declarations: [PaymentApplicationComponent, PaymentApplicationDetailComponent, PaymentApplicationUpdateComponent],
  entryComponents: [PaymentApplicationComponent, PaymentApplicationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwPaymentApplicationModule {}
