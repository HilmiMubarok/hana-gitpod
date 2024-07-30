import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditRatingViewComponent } from './credit-rating-view.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CreditRatingViewComponent],
  exports: [CreditRatingViewComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreditRatingModule {}
