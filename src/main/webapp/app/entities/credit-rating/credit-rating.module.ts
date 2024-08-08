import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditRatingComponent } from './credit-rating.component';
import { CreditRatingDetailComponent } from './credit-rating-detail.component';
import { CreditRatingUpdateComponent } from './credit-rating-update.component';
import { creditRatingRoute } from './credit-rating.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(creditRatingRoute)],
  declarations: [CreditRatingComponent, CreditRatingDetailComponent, CreditRatingUpdateComponent],
  entryComponents: [CreditRatingComponent, CreditRatingUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditRatingModule {}
