import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreditRatingComponent } from './list/credit-rating.component';
import { CreditRatingDetailComponent } from './detail/credit-rating-detail.component';
import { CreditRatingUpdateComponent } from './update/credit-rating-update.component';
import { CreditRatingDeleteDialogComponent } from './delete/credit-rating-delete-dialog.component';
import { CreditRatingRoutingModule } from './route/credit-rating-routing.module';

@NgModule({
  imports: [SharedModule, CreditRatingRoutingModule],
  declarations: [CreditRatingComponent, CreditRatingDetailComponent, CreditRatingUpdateComponent, CreditRatingDeleteDialogComponent],
  entryComponents: [CreditRatingDeleteDialogComponent],
})
export class CreditRatingModule {}
