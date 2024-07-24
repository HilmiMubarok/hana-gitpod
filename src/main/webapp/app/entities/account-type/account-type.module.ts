import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AccountTypeComponent } from './account-type.component';
import { AccountTypeDetailComponent } from './account-type-detail.component';
import { AccountTypeUpdateComponent } from './account-type-update.component';
import { accountTypeRoute } from './account-type.route';
import { AccountTypeViewComponent } from './account-type-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(accountTypeRoute)],
  declarations: [AccountTypeComponent, AccountTypeDetailComponent, AccountTypeUpdateComponent, AccountTypeViewComponent],
  entryComponents: [AccountTypeComponent, AccountTypeUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LosgwAccountTypeModule {}
