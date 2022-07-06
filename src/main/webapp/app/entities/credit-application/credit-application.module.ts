import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { CreditApplicationComponent } from './credit-application.component';
import { CreditApplicationDetailComponent } from './credit-application-detail.component';
import { CreditApplicationUpdateComponent } from './credit-application-update.component';
import { creditApplicationRoute } from './credit-application.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(creditApplicationRoute)],
  declarations: [CreditApplicationComponent, CreditApplicationDetailComponent, CreditApplicationUpdateComponent],
  entryComponents: [CreditApplicationComponent, CreditApplicationUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwCreditApplicationModule {}
