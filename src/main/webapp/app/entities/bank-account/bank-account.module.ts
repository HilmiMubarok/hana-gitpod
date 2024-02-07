import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { partyCifRoute } from './bank-account.route';
import { BankAccountDetailComponent } from './bank-account-detail.component';
import { BankAccountComponent } from './bank-account.component';
import { BankAccountDialogComponent } from './bank-account-dialog.component';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(partyCifRoute)],
  declarations: [BankAccountComponent, BankAccountDetailComponent, BankAccountDialogComponent],
  entryComponents: [BankAccountComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankAccountModule {}
