import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedEntityModule } from 'app/entities/shared-entity.module';
import { SharedModule } from 'app/shared/shared.module';
import { AccountComponent } from './account.component';
import { AccountDetailComponent } from './account-detail.component';
import { AccountUpdateComponent } from './account-update.component';
import { accountRoute } from './account.route';

@NgModule({
  imports: [SharedModule, SharedEntityModule, RouterModule.forChild(accountRoute)],
  declarations: [AccountComponent, AccountDetailComponent, AccountUpdateComponent],
  entryComponents: [AccountComponent, AccountUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountModule {}
