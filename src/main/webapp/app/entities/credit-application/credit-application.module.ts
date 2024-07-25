import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { creditApplicationRoute } from './credit-application.route';
import { CreditApplicationViewComponent } from './credit-application-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(creditApplicationRoute)],
  declarations: [CreditApplicationViewComponent],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditApplicationModule {}
